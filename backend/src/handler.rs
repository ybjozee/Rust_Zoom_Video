use std::sync::Arc;

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::Json;
use serde_json::{json, Value};

use crate::{AppState, helper, token};
use crate::helper::hash;
use crate::model::{JoinRoomRequest, NewRoomRequest, Room, RoomResponse};

pub async fn create_room(State(state): State<Arc<AppState>>, Json(payload): Json<NewRoomRequest>) -> (StatusCode, Json<RoomResponse>) {
    let room_name = payload.name;
    if room_name == "" {
        return (StatusCode::BAD_REQUEST, Json(RoomResponse::Error(json!({"error": "Room name cannot be empty"}))));
    }
    let mut room_passcode = payload.passcode;
    if let Some(passcode) = room_passcode {
        room_passcode = Some(format!("{:?}", hash(passcode)));
    }
    let identity = helper::identity();
    return if let Ok(room) = state.db.create_room(room_name, room_passcode, identity).await {
        (StatusCode::CREATED, Json(RoomResponse::Success(room)))
    } else {
        (StatusCode::BAD_REQUEST, Json(RoomResponse::Error(json!({"error": "Could not create new room"}))))
    };
}

pub async fn get_all_rooms(State(state): State<Arc<AppState>>) -> Json<Vec<Room>> {
    return if let Ok(rooms) = state.db.get_all_rooms().await {
        Json(rooms)
    } else { Json(vec![]) };
}

pub async fn get_room(State(state): State<Arc<AppState>>, Path(id): Path<String>) -> (StatusCode, Json<RoomResponse>) {
    if let Ok(room) = state.db.get_room(&id).await {
        return (StatusCode::OK, Json(RoomResponse::Success(room)));
    }
    return (StatusCode::NOT_FOUND, Json(RoomResponse::Error(json!({"error": "Could not find room with provided identity"}))));
}

pub async fn get_room_token(State(state): State<Arc<AppState>>, Json(payload): Json<JoinRoomRequest>) -> (StatusCode, Json<Value>) {
    let Some(identity) = payload.identity else {
        return (StatusCode::BAD_REQUEST, Json(json!({"error": "room identity is required"})));
    };

    let Ok(room) = state.db.get_room(&identity).await else {
        return (StatusCode::NOT_FOUND, Json(json!({"error": "Could not find room with provided identity"})));
    };

    return if room.is_valid_passcode(payload.passcode) {
        let user_identity = format!("Anon_{}", helper::identity());
        (StatusCode::OK, Json(json!({"token": token::generate(&identity, &user_identity), "user": user_identity})))
    } else {
        (StatusCode::BAD_REQUEST, Json(json!({"error": "Invalid room passcode provided"})))
    };
}

