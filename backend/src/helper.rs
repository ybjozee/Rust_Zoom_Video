use md5;
use md5::Digest;
use rand::{Rng, thread_rng};
use rand::distributions::Alphanumeric;

pub fn hash(secret: String) -> Digest {
    md5::compute(secret)
}

pub fn identity() -> String {
    let rand_string: String = thread_rng()
        .sample_iter(&Alphanumeric)
        .take(15)
        .map(char::from)
        .collect();
    format!("{:x}", hash(rand_string))
}

