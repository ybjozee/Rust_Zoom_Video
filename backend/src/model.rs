use serde::{Deserialize, Serialize};
use serde::ser::{Serialize as SerializeTrait, Serializer, SerializeStruct};
use serde_json::Value;

use crate::helper;

#[derive(Serialize, Deserialize)]
pub struct Claim<'a> {
    pub iat: i64,
    pub nbf: i64,
    pub exp: i64,
    pub app_key: String,
    pub role_type: i8,
    pub version: i8,
    pub tpc: &'a str,
    pub user_identity: &'a str,
}

#[derive(Serialize, Deserialize)]
pub struct NewRoomRequest {
    pub name: String,
    pub passcode: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct JoinRoomRequest {
    pub identity: Option<String>,
    pub passcode: Option<String>,
}

#[derive(Serialize)]
#[serde(untagged)]
pub enum RoomResponse {
    Success(Room),
    Error(Value),
}

#[derive(sqlx::FromRow)]
pub struct Room {
    pub id: i64,
    pub name: String,
    pub passcode: Option<String>,
    pub identity: Option<String>,
}

impl Room {
    pub fn is_valid_passcode(&self, passcode: Option<String>) -> bool {
        return match &self.passcode {
            None => true,
            Some(expected_passcode) => {
                return if let Some(provided_passcode) = passcode {
                    *expected_passcode == format!("{:?}", helper::hash(provided_passcode))
                } else {
                    false
                };
            }
        };
    }
}

impl SerializeTrait for Room {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut has_passcode = false;
        if let Some(_) = &self.passcode {
            has_passcode = true;
        }
        let mut s = serializer.serialize_struct("Room", 3)?;
        s.serialize_field("name", &self.name)?;
        s.serialize_field("identity", &self.identity)?;
        s.serialize_field("hasPasscode", &has_passcode)?;
        s.end()
    }
}

