use std::env;
use std::sync::Arc;

use axum::http::HeaderValue;
use axum::Router;
use axum::routing::{get, post};
use dotenvy::dotenv;
use sqlx::SqlitePool;

use crate::handler::{create_room, get_all_rooms, get_room, get_room_token};
use crate::database::{AppState, Database};

mod helper;
mod model;
mod database;
mod token;
mod handler;


#[tokio::main]
async fn main() {
    dotenv().ok();

    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL could not be retrieved.");
    let db_pool = SqlitePool::connect(&db_url).await.unwrap();
    let shared_state = Arc::new(AppState { db: Database::new(db_pool) });
    let frontend_port = env::var("FRONTEND_PORT").expect("FRONTEND_PORT could not be retrieved.");

    let allowed_origins = [
        format!("http://127.0.0.1:{}", &frontend_port).parse::<HeaderValue>().unwrap(),
        format!("http://localhost:{}", &frontend_port).parse::<HeaderValue>().unwrap()
    ];

    let app = Router::new().route("/", get(get_all_rooms))
        .route("/room", post(create_room))
        .route("/token", post(get_room_token))
        .route("/room/:id", get(get_room))
        .with_state(shared_state)
        .layer(tower_http::cors::CorsLayer::new()
            .allow_origin(allowed_origins)
            .allow_methods([axum::http::Method::GET, axum::http::Method::POST])
            .allow_headers([axum::http::header::CONTENT_TYPE])
        );

    let server_port = env::var("SERVER_PORT").expect("SERVER_PORT could not be retrieved.");
    let address = format!("0.0.0.0:{}", server_port);
    let listener = tokio::net::TcpListener::bind(address).await.unwrap();

    axum::serve(listener, app)
        .await
        .unwrap();
}

