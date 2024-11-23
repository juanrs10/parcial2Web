/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MedicoPacienteService } from './medico-paciente.service';
import { MedicoEntity } from '../service/medico.entity/medico.entity';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';

describe('MedicoPacienteService', () => {
  let service: MedicoPacienteService;
  let medicoRepository: Repository<MedicoEntity>;
  let pacienteRepository: Repository<PacienteEntity>;
  let medico: MedicoEntity;
  let pacientesList: PacienteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MedicoPacienteService],
    }).compile();

    service = module.get<MedicoPacienteService>(MedicoPacienteService);
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    pacienteRepository.clear();
    medicoRepository.clear();

    pacientesList = [];
    for (let i = 0; i < 3; i++) {
      const paciente = await pacienteRepository.save({
        nombre: faker.name.fullName(),
        edad: faker.number.int({ min: 1, max: 100 }),
      });
      pacientesList.push(paciente);
    }

    medico = await medicoRepository.save({
      nombre: faker.name.fullName(),
      especialidad: faker.lorem.word(),
      pacientes: pacientesList,
      telefono: faker.phone.number()
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addPacienteToMedico should add a patient to a doctor', async () => {
    const newPaciente = await pacienteRepository.save({
      nombre: faker.name.fullName(),
      edad: faker.number.int({ min: 1, max: 100 }),
    });

    const updatedMedico = await service.addPacienteToMedico(medico.id, newPaciente.id);

    expect(updatedMedico.pacientes.length).toBe(4);
    expect(updatedMedico.pacientes.some((p) => p.id === newPaciente.id)).toBe(true);
  });

  it('addPacienteToMedico should throw an exception for an invalid patient', async () => {
    await expect(service.addPacienteToMedico(medico.id, '0')).rejects.toHaveProperty(
      'message',
      'The patient with the given id was not found',
    );
  });

  it('addPacienteToMedico should throw an exception for an invalid doctor', async () => {
    const newPaciente = await pacienteRepository.save({
      nombre: faker.name.fullName(),
      edad: faker.number.int({ min: 1, max: 100 }),
    });

    await expect(service.addPacienteToMedico('0', newPaciente.id)).rejects.toHaveProperty(
      'message',
      'The doctor with the given id was not found',
    );
  });

  it('findPacienteByMedicoIdAndPacienteId should return a patient by doctor and patient id', async () => {
    const paciente = pacientesList[0];
    const storedPaciente = await service.findPacienteByMedicoIdAndPacienteId(medico.id, paciente.id);

    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toBe(paciente.nombre);
  });

  it('findPacienteByMedicoIdAndPacienteId should throw an exception for an invalid patient', async () => {
    await expect(service.findPacienteByMedicoIdAndPacienteId(medico.id, '0')).rejects.toHaveProperty(
      'message',
      'The patient with the given id was not found',
    );
  });

  it('findPacienteByMedicoIdAndPacienteId should throw an exception for an invalid doctor', async () => {
    const paciente = pacientesList[0];
    await expect(service.findPacienteByMedicoIdAndPacienteId('0', paciente.id)).rejects.toHaveProperty(
      'message',
      'The doctor with the given id was not found',
    );
  });

  it('findPacientesByMedicoId should return patients by doctor id', async () => {
    const pacientes = await service.findPacientesByMedicoId(medico.id);
    expect(pacientes.length).toBe(3);
  });

  it('findPacientesByMedicoId should throw an exception for an invalid doctor', async () => {
    await expect(service.findPacientesByMedicoId('0')).rejects.toHaveProperty(
      'message',
      'The doctor with the given id was not found',
    );
  });

  it('associatePacientesToMedico should update the list of patients for a doctor', async () => {
    const newPacientes = [
      await pacienteRepository.save({
        nombre: faker.name.fullName(),
        edad: faker.number.int({ min: 1, max: 100 }),
      }),
    ];

    const updatedMedico = await service.associatePacientesToMedico(medico.id, newPacientes);

    expect(updatedMedico.pacientes.length).toBe(1);
    expect(updatedMedico.pacientes[0].id).toBe(newPacientes[0].id);
  });

  it('deletePacienteFromMedico should remove a patient from a doctor', async () => {
    const paciente = pacientesList[0];
    await service.deletePacienteFromMedico(medico.id, paciente.id);

    const updatedMedico = await medicoRepository.findOne({
      where: { id: medico.id },
      relations: ['pacientes'],
    });

    expect(updatedMedico.pacientes.length).toBe(2);
    expect(updatedMedico.pacientes.some((p) => p.id === paciente.id)).toBe(false);
  });
});
