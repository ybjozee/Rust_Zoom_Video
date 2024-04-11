use std::{env, time::{SystemTime, UNIX_EPOCH}};
use jsonwebtoken::{EncodingKey, Header};
use jsonwebtoken::encode;
use crate::model::Claim;

pub fn generate(room_identity: &str, user_name: &str) -> String {
    let zoom_key =
        env::var("ZOOM_VIDEO_SDK_KEY").expect("Zoom video SDK key could not be retrieved.");

    let zoom_secret =
        env::var("ZOOM_VIDEO_SDK_SECRET").expect("Zoom video SDK secret could not be retrieved.");

    let token_ttl = env::var("TOKEN_TTL").expect("Token TTL could not be retrieved.");

    let current_time = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Clock may have gone backwards")
        .as_secs() as i64;

    let expiry = current_time + token_ttl.parse::<i64>().unwrap();

    let header = Header::default();

    let claim = Claim {
        iat: current_time,
        nbf: current_time,
        exp: expiry,
        app_key: zoom_key,
        role_type: 1,
        version: 1,
        tpc: room_identity,
        user_identity: user_name,
    };

    encode(
        &header,
        &claim,
        &EncodingKey::from_secret(zoom_secret.as_ref()),
    )
    .unwrap()
}

