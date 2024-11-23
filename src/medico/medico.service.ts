/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicoEntity } from '../service/medico.entity/medico.entity';
import { BusinessError, BusinessLogicException } from '../business-errors';

@Injectable()
export class MedicoService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
  ) {}

  /**
   * Obtener todos los médicos
   */
  async findAll(): Promise<MedicoEntity[]> {
    return await this.medicoRepository.find({ relations: ['pacientes'] });
  }

  /**
   * Buscar un médico por ID
   * @param id - ID del médico
   */
  async findOne(id: string): Promise<MedicoEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id },
      relations: ['pacientes'],
    });
    if (!medico) {
      throw new BusinessLogicException(
        'El médico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return medico;
  }

  /**
   * Crear un nuevo médico
   * @param medico - Datos del médico
   */
  async create(medico: MedicoEntity): Promise<MedicoEntity> {
    if (!medico.nombre || !medico.especialidad || !medico.telefono) {
      throw new BusinessLogicException(
        'El nombre, especialidad y teléfono son obligatorios para crear un médico',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.medicoRepository.save(medico);
  }

  /**
   * Eliminar un médico por ID
   * @param id - ID del médico
   */
  async delete(id: string) {
    const medico: MedicoEntity = await this.medicoRepository.findOne({ where: { id } });
    if (!medico) {
      throw new BusinessLogicException(
        'El médico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    await this.medicoRepository.remove(medico);
  }

  /**
   * Actualizar un médico por ID
   * @param id - ID del médico
   * @param medico - Nuevos datos del médico
   */
  async update(id: string, medico: MedicoEntity): Promise<MedicoEntity> {
    const existingMedico = await this.medicoRepository.findOne({ where: { id } });

    if (!existingMedico) {
      throw new BusinessLogicException(
        'El médico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (medico.nombre) existingMedico.nombre = medico.nombre;
    if (medico.especialidad) existingMedico.especialidad = medico.especialidad;
    if (medico.telefono) existingMedico.telefono = medico.telefono;

    return await this.medicoRepository.save(existingMedico);
  }
}
