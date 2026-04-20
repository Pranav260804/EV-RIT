CREATE TABLE user_activity (
  id serial primary key, 
  email text, 
  provider text, 
  login_time timestamp default now()
);
