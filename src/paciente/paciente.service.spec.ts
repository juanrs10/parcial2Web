/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';
import { PacienteService } from './paciente.service';
import { BusinessLogicException } from '../business-errors';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a patient successfully', async () => {
    const paciente: PacienteEntity = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      nombre: 'Juan Pérez',
      genero: 'M',
      medicos: [],
      diagnosticos: [],
    };

    const savedPaciente = await service.create(paciente);

    expect(savedPaciente).toBeDefined();
    expect(savedPaciente.nombre).toEqual(paciente.nombre);
    expect(savedPaciente.genero).toEqual(paciente.genero);

    const foundPaciente = await repository.findOne({ where: { id: savedPaciente.id } });
    expect(foundPaciente).toBeDefined();
    expect(foundPaciente.nombre).toEqual(paciente.nombre);
    expect(foundPaciente.genero).toEqual(paciente.genero);
  });

  it('should throw an exception when creating a patient with a name shorter than 3 characters', async () => {
    const paciente: PacienteEntity = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      nombre: 'Jo',
      genero: 'M',
      medicos: [],
      diagnosticos: [],
    };

    await expect(service.create(paciente)).rejects.toThrow(BusinessLogicException);

    const foundPaciente = await repository.findOne({ where: { id: paciente.id } });
    expect(foundPaciente).toBeUndefined(); // Ensure the patient wasn't saved
  });
});
