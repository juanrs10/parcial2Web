/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from '../service/diagnostico.entity/diagnostico.entity';
import { BusinessLogicException, BusinessError } from '../business-errors';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticoService,
        {
          provide: getRepositoryToken(DiagnosticoEntity),
          useClass: Repository, // Simula el repositorio
        },
      ],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all diagnosticos', async () => {
    const diagnosticosArray: DiagnosticoEntity[] = [
      { id: '1', descripcion: 'Diagnóstico 1' } as DiagnosticoEntity,
      { id: '2', descripcion: 'Diagnóstico 2' } as DiagnosticoEntity,
    ];
    jest.spyOn(repository, 'find').mockResolvedValue(diagnosticosArray);

    const result = await service.findAll();
    expect(result).toEqual(diagnosticosArray);
  });

  it('should find one diagnostico by id', async () => {
    const diagnostico: DiagnosticoEntity = { id: '1', descripcion: 'Diagnóstico 1' } as DiagnosticoEntity;
    jest.spyOn(repository, 'findOne').mockResolvedValue(diagnostico);

    const result = await service.findOne('1');
    expect(result).toEqual(diagnostico);
  });

  it('should throw an exception when finding a diagnostico that does not exist', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('non-existing-id')).rejects.toThrow(BusinessLogicException);
    await expect(service.findOne('non-existing-id')).rejects.toThrowError(
      new BusinessLogicException('El diagnóstico con el ID proporcionado no fue encontrado', BusinessError.NOT_FOUND),
    );
  });

  it('should create a diagnostico successfully', async () => {
    const diagnostico: DiagnosticoEntity = { id: '1', descripcion: 'Diagnóstico válido' } as DiagnosticoEntity;
    jest.spyOn(repository, 'save').mockResolvedValue(diagnostico);

    const result = await service.create(diagnostico);
    expect(result).toEqual(diagnostico);
    expect(repository.save).toHaveBeenCalledWith(diagnostico);
  });

  it('should throw an exception when creating a diagnostico with a description longer than 200 characters', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '2',
      descripcion: 'A'.repeat(201), // Descripción con más de 200 caracteres
    } as DiagnosticoEntity;

    await expect(service.create(diagnostico)).rejects.toThrow(BusinessLogicException);
    await expect(service.create(diagnostico)).rejects.toThrowError(
      new BusinessLogicException('La descripción del diagnóstico no puede exceder los 200 caracteres', BusinessError.PRECONDITION_FAILED),
    );
  });

  it('should delete a diagnostico successfully', async () => {
    const diagnostico: DiagnosticoEntity = { id: '1', descripcion: 'Diagnóstico 1' } as DiagnosticoEntity;
    jest.spyOn(repository, 'findOne').mockResolvedValue(diagnostico);
    jest.spyOn(repository, 'remove').mockResolvedValue(diagnostico);

    await service.delete('1');
    expect(repository.remove).toHaveBeenCalledWith(diagnostico);
  });

  it('should throw an exception when deleting a diagnostico that does not exist', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.delete('non-existing-id')).rejects.toThrow(BusinessLogicException);
    await expect(service.delete('non-existing-id')).rejects.toThrowError(
      new BusinessLogicException('El diagnóstico con el ID proporcionado no fue encontrado', BusinessError.NOT_FOUND),
    );
  });
});
