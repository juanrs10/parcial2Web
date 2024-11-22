/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { DiagnosticoPacienteService } from './diagnostico-paciente.service';
import { DiagnosticoEntity } from '../service/diagnostico.entity/diagnostico.entity';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('DiagnosticoPacienteService', () => {
  let service: DiagnosticoPacienteService;
  let diagnosticoRepository: Repository<DiagnosticoEntity>;
  let pacienteRepository: Repository<PacienteEntity>;
  let paciente: PacienteEntity;
  let diagnosticosList: DiagnosticoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoPacienteService],
    }).compile();

    service = module.get<DiagnosticoPacienteService>(DiagnosticoPacienteService);
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    diagnosticoRepository.clear();
    pacienteRepository.clear();

    diagnosticosList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico = await diagnosticoRepository.save({
        descripcion: faker.lorem.sentence(),
        fecha: faker.date.past(),
      });
      diagnosticosList.push(diagnostico);
    }

    paciente = await pacienteRepository.save({
      nombre: faker.name.fullName(),
      edad: faker.number.int({ min: 1, max: 100 }),
      diagnosticos: diagnosticosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addDiagnosticoToPaciente should add a diagnosis to a patient', async () => {
    const newDiagnostico = await diagnosticoRepository.save({
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
    });

    const result = await service.addDiagnosticoToPaciente(paciente.id, newDiagnostico.id);

    expect(result.diagnosticos.length).toBe(6);
    expect(result.diagnosticos.some(d => d.id === newDiagnostico.id)).toBeTruthy();
  });

  it('addDiagnosticoToPaciente should throw an exception for an invalid diagnosis', async () => {
    await expect(() => service.addDiagnosticoToPaciente(paciente.id, '0'))
      .rejects.toHaveProperty('message', 'El diagnóstico con el ID proporcionado no fue encontrado');
  });

  it('addDiagnosticoToPaciente should throw an exception for an invalid patient', async () => {
    const diagnostico = diagnosticosList[0];

    await expect(() => service.addDiagnosticoToPaciente('0', diagnostico.id))
      .rejects.toHaveProperty('message', 'El paciente con el ID proporcionado no fue encontrado');
  });

  it('findDiagnosticoByPacienteIdDiagnosticoId should return a diagnosis by patient', async () => {
    const diagnostico = diagnosticosList[0];
    const result = await service.findDiagnosticoByPacienteIdDiagnosticoId(paciente.id, diagnostico.id);

    expect(result).not.toBeNull();
    expect(result.descripcion).toBe(diagnostico.descripcion);
  });

  it('findDiagnosticoByPacienteIdDiagnosticoId should throw an exception for an invalid diagnosis', async () => {
    await expect(() => service.findDiagnosticoByPacienteIdDiagnosticoId(paciente.id, '0'))
      .rejects.toHaveProperty('message', 'El diagnóstico con el ID proporcionado no fue encontrado');
  });

  it('findDiagnosticoByPacienteIdDiagnosticoId should throw an exception for an unassociated diagnosis', async () => {
    const newDiagnostico = await diagnosticoRepository.save({
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
    });

    await expect(() => service.findDiagnosticoByPacienteIdDiagnosticoId(paciente.id, newDiagnostico.id))
      .rejects.toHaveProperty('message', 'El diagnóstico con el ID proporcionado no está asociado al paciente');
  });

  it('findDiagnosticosByPacienteId should return all diagnoses by patient', async () => {
    const result = await service.findDiagnosticosByPacienteId(paciente.id);

    expect(result.length).toBe(5);
    expect(result[0].descripcion).toBe(diagnosticosList[0].descripcion);
  });

  it('findDiagnosticosByPacienteId should throw an exception for an invalid patient', async () => {
    await expect(() => service.findDiagnosticosByPacienteId('0'))
      .rejects.toHaveProperty('message', 'El paciente con el ID proporcionado no fue encontrado');
  });

  it('associateDiagnosticosToPaciente should update the diagnoses list for a patient', async () => {
    const newDiagnostico = await diagnosticoRepository.save({
      descripcion: faker.lorem.sentence(),
      fecha: faker.date.past(),
    });

    const result = await service.associateDiagnosticosToPaciente(paciente.id, [newDiagnostico]);

    expect(result.diagnosticos.length).toBe(1);
    expect(result.diagnosticos[0].id).toBe(newDiagnostico.id);
  });

  it('deleteDiagnosticoFromPaciente should remove a diagnosis from a patient', async () => {
    const diagnostico = diagnosticosList[0];

    await service.deleteDiagnosticoFromPaciente(paciente.id, diagnostico.id);

    const result = await pacienteRepository.findOne({
      where: { id: paciente.id },
      relations: ['diagnosticos'],
    });

    expect(result.diagnosticos.some(d => d.id === diagnostico.id)).toBeFalsy();
  });

  it('deleteDiagnosticoFromPaciente should throw an exception for an invalid diagnosis', async () => {
    await expect(() => service.deleteDiagnosticoFromPaciente(paciente.id, '0'))
      .rejects.toHaveProperty('message', 'El diagnóstico con el ID proporcionado no está asociado al paciente');
  });
});
