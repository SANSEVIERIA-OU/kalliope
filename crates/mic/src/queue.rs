// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! The sample queue between app threads and PipeWire's realtime thread.
//!
//! The realtime side never blocks, allocates or frees memory. It only *tries* the lock (one
//! atomic compare-exchange); app threads hold it for a few pointer moves, never for a copy of
//! audio. If the realtime side finds the lock taken, it plays silence for that cycle and keeps the
//! audio for the next one: a short delay, never lost samples. Audio is stored as the chunks given
//! to `push`; chunks that have been played are handed back and freed by app threads.

use std::collections::VecDeque;
use std::sync::{Mutex, MutexGuard, PoisonError, TryLockError};

#[derive(Default)]
pub struct Queue(Mutex<Chunks>);

#[derive(Default)]
struct Chunks {
    chunks: VecDeque<Box<[f32]>>,
    /// Samples of the front chunk already played.
    offset: usize,
    /// Samples still to play.
    len: usize,
    /// Played chunks, waiting to be freed by an app thread. Its capacity always covers every
    /// queued chunk, so the realtime side can push without allocating.
    spent: Vec<Box<[f32]>>,
}

impl Queue {
    /// Appends a copy of `samples`. App threads only.
    pub fn push(&self, samples: &[f32]) {
        if samples.is_empty() {
            return;
        }
        let chunk: Box<[f32]> = samples.into(); // copied before taking the lock
        let mut q = self.lock();
        q.len += chunk.len();
        q.chunks.push_back(chunk);
        let spent = q.reclaim();
        drop(q);
        drop(spent);
    }

    /// Drops all queued audio. App threads only.
    pub fn clear(&self) {
        let mut q = self.lock();
        let chunks = std::mem::take(&mut q.chunks);
        q.offset = 0;
        q.len = 0;
        let spent = std::mem::take(&mut q.spent);
        drop(q);
        drop((chunks, spent));
    }

    /// Samples still to play; also frees played chunks. App threads only.
    pub fn queued(&self) -> usize {
        let mut q = self.lock();
        let len = q.len;
        let spent = q.reclaim();
        drop(q);
        drop(spent);
        len
    }

    /// Moves queued samples into `out` and fills the rest with silence; returns how many samples
    /// came from the queue. Realtime safe.
    pub fn take(&self, out: &mut [f32]) -> usize {
        let mut q = match self.0.try_lock() {
            Ok(q) => q,
            Err(TryLockError::Poisoned(e)) => e.into_inner(),
            Err(TryLockError::WouldBlock) => {
                out.fill(0.0);
                return 0;
            }
        };
        let q = &mut *q;
        let mut n = 0;
        while n < out.len() {
            let Some(front) = q.chunks.front() else { break };
            let k = (front.len() - q.offset).min(out.len() - n);
            out[n..n + k].copy_from_slice(&front[q.offset..q.offset + k]);
            n += k;
            q.offset += k;
            if q.offset == front.len() {
                q.offset = 0;
                if let Some(chunk) = q.chunks.pop_front() {
                    // Never reallocates: `spent` has room for every queued chunk.
                    q.spent.push(chunk);
                }
            }
        }
        q.len -= n;
        out[n..].fill(0.0);
        n
    }

    fn lock(&self) -> MutexGuard<'_, Chunks> {
        self.0.lock().unwrap_or_else(PoisonError::into_inner)
    }
}

impl Chunks {
    /// Swaps out the played chunks, to be freed after the lock is released, and makes room for
    /// every queued chunk to become spent.
    fn reclaim(&mut self) -> Vec<Box<[f32]>> {
        if self.spent.is_empty() && self.spent.capacity() >= self.chunks.len() {
            return Vec::new();
        }
        std::mem::replace(&mut self.spent, Vec::with_capacity(self.chunks.len()))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn plays_chunks_in_order_then_silence() {
        let queue = Queue::default();
        queue.push(&[1.0, 2.0, 3.0]);
        queue.push(&[4.0]);
        queue.push(&[]);
        let mut out = [9.0; 3];
        assert_eq!(queue.take(&mut out), 3);
        assert_eq!(out, [1.0, 2.0, 3.0]);
        assert_eq!(queue.queued(), 1);
        let mut out = [9.0; 3];
        assert_eq!(queue.take(&mut out), 1);
        assert_eq!(out, [4.0, 0.0, 0.0]);
        assert_eq!(queue.take(&mut out), 0);
        assert_eq!(out, [0.0; 3]);
        assert_eq!(queue.queued(), 0);
    }

    #[test]
    fn spent_chunks_never_reallocate_on_the_realtime_side() {
        let queue = Queue::default();
        for i in 0..100 {
            queue.push(&[i as f32; 7]);
        }
        let capacity = queue.lock().spent.capacity();
        assert!(capacity >= 100);
        let mut out = [0.0; 1000];
        assert_eq!(queue.take(&mut out), 700);
        assert_eq!(queue.lock().spent.capacity(), capacity);
        assert_eq!(out[699], 99.0);
        assert_eq!(queue.queued(), 0);
        assert!(queue.lock().spent.is_empty());
    }

    #[test]
    fn clear_drops_everything() {
        let queue = Queue::default();
        queue.push(&[0.5; 10]);
        let mut out = [0.0; 4];
        queue.take(&mut out);
        queue.clear();
        assert_eq!(queue.queued(), 0);
        assert_eq!(queue.take(&mut out), 0);
        queue.push(&[0.25; 2]);
        assert_eq!(queue.take(&mut out), 2);
        assert_eq!(out, [0.25, 0.25, 0.0, 0.0]);
    }

    #[test]
    fn busy_lock_means_silence_and_nothing_lost() {
        let queue = Queue::default();
        queue.push(&[0.5; 4]);
        let mut out = [9.0; 4];
        let guard = queue.lock();
        assert_eq!(queue.take(&mut out), 0);
        assert_eq!(out, [0.0; 4]);
        drop(guard);
        assert_eq!(queue.take(&mut out), 4);
        assert_eq!(out, [0.5; 4]);
    }
}
