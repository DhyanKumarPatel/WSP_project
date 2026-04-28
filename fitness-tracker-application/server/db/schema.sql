

-- Create enums for categorical values
CREATE TYPE user_role AS ENUM ('admin', 'member');
CREATE TYPE activity_type AS ENUM ('Running', 'Walking', 'Cycling', 'Gym', 'Yoga', 'Swimming');

-- Maps to: User
CREATE TABLE users (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    role        user_role NOT NULL DEFAULT 'member',
    age         INTEGER,
    height_cm   INTEGER,
    weight_kg   INTEGER,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maps to: Activity (with user_id as foreign key)
CREATE TABLE activities (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        activity_type NOT NULL,
    date        DATE NOT NULL,
    duration_min INTEGER NOT NULL,
    calories    INTEGER NOT NULL,
    notes       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maps to: Friendship (bidirectional relationships)
CREATE TABLE friendships (
    id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    friend_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Prevent duplicate friendships (same pair of users)
ALTER TABLE friendships
ADD CONSTRAINT unique_friendship UNIQUE (user_id, friend_id);
