# Functionnality

## formats

- [ ] add format
- [ ] edit format
- [ ] delete format
- [ ] get format
- [ ] auto update rotation for standard

## Mecanics

- [ ] Create a fabric that sense all the services, controllers, repositories and entities and use their fabrics to instance them by passing them the services controllers and repositories they need
- [ ] Create micro services to handle the different needs by pre formatting the data before sending it to the client or sending it to the database that will be used directly be used by the controllers and only then passed to the required services. This to make main services lighter and more readable (this idea need further research in term of performance and security)