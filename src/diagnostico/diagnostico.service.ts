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

  /**
   * Actualizar un diagnóstico por ID
   * @param id - ID del diagnóstico
   * @param diagnostico - Nuevos datos del diagnóstico
   */
  async update(id: string, diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
    // Buscar el diagnóstico a actualizar
    const existingDiagnostico = await this.diagnosticoRepository.findOne({ where: { id } });
    
    // Si no existe, lanzar un error
    if (!existingDiagnostico) {
      throw new BusinessLogicException(
        'El diagnóstico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    // Verificar si la descripción no excede los 200 caracteres
    if (diagnostico.descripcion && diagnostico.descripcion.length > 200) {
      throw new BusinessLogicException(
        'La descripción del diagnóstico no puede exceder los 200 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    // Actualizar solo los campos necesarios
    existingDiagnostico.descripcion = diagnostico.descripcion || existingDiagnostico.descripcion;
    // Puedes agregar más campos aquí si es necesario (por ejemplo, otros atributos del diagnóstico)

    // Guardar los cambios
    return await this.diagnosticoRepository.save(existingDiagnostico);
  }
}
