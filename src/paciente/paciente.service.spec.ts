/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';
import { PacienteService } from './paciente.service';
import { BusinessLogicException } from '../business-errors';
import { MedicoEntity } from 'src/service/medico.entity/medico.entity';

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
    expect(foundPaciente).toBeNull(); // Ensure the patient wasn't saved
  });

  it('should return all patients with their relations', async () => {
    const pacientes: PacienteEntity[] = [
      {
        id: '1',
        nombre: 'Paciente 1',
        genero: 'M',
        medicos: [],
        diagnosticos: [],
      },
      {
        id: '2',
        nombre: 'Paciente 2',
        genero: 'F',
        medicos: [],
        diagnosticos: [],
      },
    ];
  
    jest.spyOn(repository, 'find').mockResolvedValue(pacientes);
  
    const result = await service.findAll();
  
    expect(result).toBeDefined();
    expect(result.length).toEqual(2);
    expect(result[0].nombre).toEqual('Paciente 1');
  });
  
  it('should find one patient by ID', async () => {
    const paciente: PacienteEntity = {
      id: '1',
      nombre: 'Paciente 1',
      genero: 'M',
      medicos: [],
      diagnosticos: [],
    };
  
    jest.spyOn(repository, 'findOne').mockResolvedValue(paciente);
  
    const result = await service.findOne('1');
  
    expect(result).toBeDefined();
    expect(result.id).toEqual('1');
    expect(result.nombre).toEqual('Paciente 1');
  });
  
  it('should throw an exception when patient not found by ID', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
  
    await expect(service.findOne('non-existent-id')).rejects.toThrow(BusinessLogicException);
  });
  
  it('should delete a patient successfully', async () => {
    const paciente: PacienteEntity = {
      id: '1',
      nombre: 'Paciente 1',
      genero: 'M',
      medicos: [],
      diagnosticos: [],
    };
  
    jest.spyOn(repository, 'findOne').mockResolvedValue(paciente);
    jest.spyOn(repository, 'remove').mockResolvedValue(paciente);
  
    await expect(service.delete('1')).resolves.not.toThrow();
  });
  
  it('should throw an exception when trying to delete a patient with associated diagnostics', async () => {
    const paciente: PacienteEntity = {
      id: '1',
      nombre: 'Paciente 1',
      genero: 'M',
      medicos: [],
      diagnosticos: [{ id: 'diag1',
        nombre: "Name",
        descripcion: "Desc",
        pacientes: []
      }], // Dummy diagnostic data
    };
  
    jest.spyOn(repository, 'findOne').mockResolvedValue(paciente);
  
    await expect(service.delete('1')).rejects.toThrow(BusinessLogicException);
  });
  
  it('should assign a doctor to a patient successfully', async () => {
    const paciente: PacienteEntity = {
      id: '1',
      nombre: 'Paciente 1',
      genero: 'M',
      medicos: [],
      diagnosticos: [],
    };
  
    const medico: MedicoEntity = {
      id: '1',
      nombre: 'Medico 1',
      especialidad: 'Cardiología',
      telefono: '39393939393',
      pacientes: [],
    };
  
    const pacienteRepositoryMock = jest.spyOn(repository, 'findOne').mockImplementation(async (criteria: any) => {
      if (criteria.where.id === '1') return paciente;
      return null;
    });
  
    const medicoRepositoryMock = jest
      .spyOn(service['medicoRepository'], 'findOne')
      .mockResolvedValue(medico);
  
    const saveMock = jest.spyOn(repository, 'save').mockResolvedValue({
      ...paciente,
      medicos: [medico],
    });
  
    await service.addMedicoToPaciente('1', '1');
  
    expect(pacienteRepositoryMock).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['medicos'],
    });
    expect(medicoRepositoryMock).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(saveMock).toHaveBeenCalled();
    expect(paciente.medicos.length).toEqual(1);
    expect(paciente.medicos[0].id).toEqual('1');
  });
  
  it('should throw an exception when trying to assign more than 5 doctors to a patient', async () => {
    const paciente: PacienteEntity = {
      id: '1',
      nombre: 'Paciente 1',
      genero: 'M',
      medicos: Array(5).fill({ id: 'dummy', nombre: 'Doctor', especialidad: 'General' }),
      diagnosticos: [],
    };
  
    const medico: MedicoEntity = {
      id: '6',
      nombre: 'Medico 6',
      especialidad: 'Dermatología',
      telefono: '393939393939',
      pacientes: []
    };
  
    jest.spyOn(repository, 'findOne').mockImplementation(async (criteria: any) => {
      if (criteria.where.id === '1') return paciente;
      return null;
    });
    
    await expect(service.addMedicoToPaciente('1', '6')).rejects.toThrow(BusinessLogicException);
  });
});
