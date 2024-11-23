/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoService } from './medico.service';
import { MedicoEntity } from '../service/medico.entity/medico.entity';
import { BusinessLogicException, BusinessError } from '../business-errors';

describe('MedicoService', () => {
  let service: MedicoService;
  let repository: Repository<MedicoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getRepositoryToken(MedicoEntity),
          useClass: Repository, // Simula el repositorio
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    repository = module.get<Repository<MedicoEntity>>(
      getRepositoryToken(MedicoEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all medicos', async () => {
    const medicosArray: MedicoEntity[] = [
      { id: '1', nombre: 'Dr. A', especialidad: 'Cardiología', telefono: '123456789' } as MedicoEntity,
      { id: '2', nombre: 'Dr. B', especialidad: 'Pediatría', telefono: '987654321' } as MedicoEntity,
    ];
    jest.spyOn(repository, 'find').mockResolvedValue(medicosArray);

    const result = await service.findAll();
    expect(result).toEqual(medicosArray);
  });

  it('should find one medico by id', async () => {
    const medico: MedicoEntity = {
      id: '1',
      nombre: 'Dr. A',
      especialidad: 'Cardiología',
      telefono: '123456789',
    } as MedicoEntity;
    jest.spyOn(repository, 'findOne').mockResolvedValue(medico);

    const result = await service.findOne('1');
    expect(result).toEqual(medico);
  });

  it('should throw an exception when finding a medico that does not exist', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('non-existing-id')).rejects.toThrow(
      BusinessLogicException,
    );
    await expect(service.findOne('non-existing-id')).rejects.toThrowError(
      new BusinessLogicException(
        'El médico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      ),
    );
  });

  it('should create a medico successfully', async () => {
    const medico: MedicoEntity = {
      id: '1',
      nombre: 'Dr. A',
      especialidad: 'Cardiología',
      telefono: '123456789',
    } as MedicoEntity;
    jest.spyOn(repository, 'save').mockResolvedValue(medico);

    const result = await service.create(medico);
    expect(result).toEqual(medico);
    expect(repository.save).toHaveBeenCalledWith(medico);
  });

  it('should throw an exception when creating a medico with missing required fields', async () => {
    const medico: MedicoEntity = {
      id: '2',
      nombre: '',
      especialidad: '',
      telefono: '',
    } as MedicoEntity;

    await expect(service.create(medico)).rejects.toThrow(
      BusinessLogicException,
    );
    await expect(service.create(medico)).rejects.toThrowError(
      new BusinessLogicException(
        'El nombre, especialidad y teléfono son obligatorios para crear un médico',
        BusinessError.PRECONDITION_FAILED,
      ),
    );
  });

  it('should delete a medico successfully', async () => {
    const medico: MedicoEntity = {
      id: '1',
      nombre: 'Dr. A',
      especialidad: 'Cardiología',
      telefono: '123456789',
    } as MedicoEntity;
    jest.spyOn(repository, 'findOne').mockResolvedValue(medico);
    jest.spyOn(repository, 'remove').mockResolvedValue(medico);

    await service.delete('1');
    expect(repository.remove).toHaveBeenCalledWith(medico);
  });

  it('should throw an exception when deleting a medico that does not exist', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.delete('non-existing-id')).rejects.toThrow(
      BusinessLogicException,
    );
    await expect(service.delete('non-existing-id')).rejects.toThrowError(
      new BusinessLogicException(
        'El médico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      ),
    );
  });

  it('should update a medico successfully', async () => {
    const existingMedico: MedicoEntity = {
      id: '1',
      nombre: 'Dr. A',
      especialidad: 'Cardiología',
      telefono: '123456789',
    } as MedicoEntity;

    const updatedData: MedicoEntity = {
      id: '1',
      nombre: 'Dr. A Updated',
      especialidad: 'Dermatología',
      telefono: '987654321',
    } as MedicoEntity;

    jest.spyOn(repository, 'findOne').mockResolvedValue(existingMedico);
    jest.spyOn(repository, 'save').mockResolvedValue(updatedData);

    const result = await service.update('1', updatedData);
    expect(result).toEqual(updatedData);
    expect(repository.save).toHaveBeenCalledWith({
      ...existingMedico,
      ...updatedData,
    });
  });

  it('should throw an exception when updating a medico that does not exist', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    const updatedData: MedicoEntity = {
      id: '1',
      nombre: 'Dr. A Updated',
      especialidad: 'Dermatología',
      telefono: '987654321',
    } as MedicoEntity;

    await expect(service.update('non-existing-id', updatedData)).rejects.toThrow(
      BusinessLogicException,
    );
    await expect(
      service.update('non-existing-id', updatedData),
    ).rejects.toThrowError(
      new BusinessLogicException(
        'El médico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      ),
    );
  });
});
