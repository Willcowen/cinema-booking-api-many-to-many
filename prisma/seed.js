const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
    const customer = await createCustomer();
    const movies = await createMovies();
    const screens = await createScreens();
    const screenings = await createScreenings(screens, movies);
    await createTicketAndSeat(customer, screens, screenings)
    process.exit(0);
}
//Create both tickets & Seats

async function createTicketAndSeat(customer, screen, screening) {

    const ticket = await prisma.ticket.create({
        data: {
            seats: {
                create: [
                    {
                        number: 1,
                        screen: {
                            connect: { id: screen[0].id }
                        }
                    }
                ]
            },
            screening: {
                connect: {id: screening[0].id}
            },
            customer: {
                connect: {id: customer.id}
            },
        },
        include: {
            screening: true,
            customer: true,
            seats: true
        }
    })
    console.log('Ticket created', ticket)
}

async function createCustomer() {
    const customer = await prisma.customer.create({
        data: {
            name: 'Alice',
            contact: {
                create: {
                    email: 'alice@boolean.co.uk',
                    phone: '1234567890'
                }
            }
        },
        include: {
            contact: true
        }
    });

    console.log('Customer created', customer);

    return customer;
}

async function createMovies() {
    const rawMovies = [
        { title: 'The Matrix', runtimeMins: 120 },
        { title: 'Dodgeball', runtimeMins: 154 },
    ];

    const movies = [];

    for (const rawMovie of rawMovies) {
        const movie = await prisma.movie.create({ data: rawMovie });
        movies.push(movie);
    }

    console.log('Movies created', movies);

    return movies;
}

async function createScreens() {
    const rawScreens = [
        { number: 1 }, { number: 2 }
    ];

    const screens = [];

    for (const rawScreen of rawScreens) {
        const screen = await prisma.screen.create({
            data: rawScreen
        });

        console.log('Screen created', screen);

        screens.push(screen);
    }

    return screens;
}

async function createScreenings(screens, movies) {
    const screeningDate = new Date();
    const screenings = []
    for (const screen of screens) {
        for (let i = 0; i < movies.length; i++) {
            screeningDate.setDate(screeningDate.getDate() + i);

            const screening = await prisma.screening.create({
                data: {
                    startsAt: screeningDate,
                    movie: {
                        connect: {
                            id: movies[i].id
                        }
                    },
                    screen: {
                        connect: {
                            id: screen.id
                        }
                    }
                }
            });
            screenings.push(screening)
            console.log('Screening created', screening);
        }
    }
    return screenings
}

seed()
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
    })
    .finally(() => process.exit(1));