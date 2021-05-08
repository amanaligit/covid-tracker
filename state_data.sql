--
-- PostgreSQL database dump
--


CREATE TABLE public.state_data (
    id integer NOT NULL,
    newcases integer NOT NULL,
    state_id integer NOT NULL
);



CREATE SEQUENCE public.state_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE public.state_data_id_seq OWNED BY public.state_data.id;


ALTER TABLE ONLY public.state_data ALTER COLUMN id SET DEFAULT nextval('public.state_data_id_seq'::regclass);





SELECT pg_catalog.setval('public.state_data_id_seq', 33, true);


ALTER TABLE ONLY public.state_data
    ADD CONSTRAINT state_data_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.state_data
    ADD CONSTRAINT state_data_state_id_fkey FOREIGN KEY (state_id) REFERENCES public.state(id);



