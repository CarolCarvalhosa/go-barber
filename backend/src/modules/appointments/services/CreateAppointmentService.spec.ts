import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointment.execute({
            date: new Date(2020, 4, 10, 13),
            user_id: 'user_id',
            provider_id: 'provider_id',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('provider_id');
    });

    it('should not be able to create two appointments on the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 10).getTime();
        });

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointment.execute({
            date: appointmentDate,
            user_id: 'user_id',
            provider_id: 'provider_id',
        });

        await expect(
            createAppointment.execute({
                date: appointmentDate,
                user_id: 'user_id',
                provider_id: 'provider_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointments on a past date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 11),
                user_id: 'user_id',
                provider_id: 'provider_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointments with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: 'user_id',
                provider_id: 'user_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create two appointments before 8am or after 6pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 10).getTime();
        });

        await createAppointment.execute({
            date: new Date(2020, 4, 10, 7),
            user_id: 'user_id',
            provider_id: 'provider_id',
        });

        await expect(
            createAppointment.execute({
                date: new Date(2020, 4, 10, 18),
                user_id: 'user_id',
                provider_id: 'provider_id',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
