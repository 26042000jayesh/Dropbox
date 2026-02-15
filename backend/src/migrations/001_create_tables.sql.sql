CREATE TABLE users (
  id bigint unsigned NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  hashed_password varchar(255) NOT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) DEFAULT NULL,
  is_active tinyint(1) NOT NULL DEFAULT '1',
  created_dt bigint unsigned NOT NULL,
  updated_dt bigint unsigned NOT NULL,
  created_by bigint unsigned DEFAULT NULL,
  updated_by bigint unsigned DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,

    object_key VARCHAR(512) NOT NULL UNIQUE,
    original_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(100) NOT NULL,
    size BIGINT NOT NULL,

    status ENUM('UPLOADING','ACTIVE','DELETED') DEFAULT 'UPLOADING',

    created_dt BIGINT NOT NULL,
    updated_dt BIGINT NOT NULL,

    INDEX idx_user_id (user_id),
    INDEX idx_user_status (user_id, status)
);
