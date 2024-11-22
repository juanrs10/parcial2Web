/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from '../service/diagnostico.entity/diagnostico.entity';
import { BusinessError, BusinessLogicException } from '../business-errors';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  /**
   * Obtener todos los diagnósticos
   */
  async findAll(): Promise<DiagnosticoEntity[]> {
    return await this.diagnosticoRepository.find();
  }

  /**
   * Buscar un diagnóstico por ID
   * @param id - ID del diagnóstico
   */
  async findOne(id: string): Promise<DiagnosticoEntity> {
    const diagnostico: DiagnosticoEntity =
      await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico) {
      throw new BusinessLogicException(
        'El diagnóstico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return diagnostico;
  }

  /**
   * Crear un nuevo diagnóstico
   * @param diagnostico - Datos del diagnóstico
   */
  async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    if (diagnostico.descripcion.length > 200) {
      throw new BusinessLogicException(
        'La descripción del diagnóstico no puede exceder los 200 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.diagnosticoRepository.save(diagnostico);
  }

  /**
   * Eliminar un diagnóstico por ID
   * @param id - ID del diagnóstico
   */
  async delete(id: string) {
    const diagnostico: DiagnosticoEntity =
      await this.diagnosticoRepository.findOne({ where: { id } });
    if (!diagnostico) {
      throw new BusinessLogicException(
        'El diagnóstico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.diagnosticoRepository.remove(diagnostico);
  }
}
