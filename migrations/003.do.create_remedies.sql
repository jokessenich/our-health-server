CREATE TABLE remedies (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    remedy_name TEXT NOT NULL,
    remedy_description TEXT NOT NULL,
    remedy_reference TEXT NOT NULL,
    remedy_malady INTEGER REFERENCES maladies(id) on delete cascade not null,
    userid INTEGER REFERENCES users(id)
)