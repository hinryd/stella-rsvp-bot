CREATE TABLE public.groups (
    group_id BIGINT NOT NULL PRIMARY KEY
);

CREATE TABLE public.events (
    group_id BIGINT NOT NULL,
    event_id uuid NOT NULL primary key DEFAULT uuid_generate_v4(), 
    event_desc character varying NOT NULL,
    event_date date NOT NULL,
    updated_at date DEFAULT now() NOT NULL,
	FOREIGN key (group_id) REFERENCES groups(group_id) on delete CASCADE
);

CREATE TABLE public.users (
    group_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL PRIMARY key,
    username character varying(100),
  	FOREIGN key (group_id) REFERENCES groups(group_id) on delete CASCADE
);

CREATE TABLE public.responses (
    event_id uuid NOT NULL,
    user_id BIGINT NOT NULL,
    nickname character varying(255),
    confirmed boolean DEFAULT true NOT NULL,
    append integer DEFAULT 0,
    PRIMARY KEY(event_id, user_id),
  	FOREIGN key (event_id) REFERENCES events(event_id) on delete CASCADE,
  	FOREIGN key (user_id) REFERENCES users(user_id) on delete CASCADE
);
