/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';
import { MedicoEntity } from '../service/medico.entity/medico.entity';
import { DiagnosticoEntity } from '../service/diagnostico.entity/diagnostico.entity';
import { BusinessError, BusinessLogicException } from '../business-errors';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,

    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,

    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,
  ) {}

  /**
   * Obtener todos los pacientes
   */
  async findAll(): Promise<PacienteEntity[]> {
    return await this.pacienteRepository.find({
      relations: ['medicos', 'diagnosticos'],
    });
  }

  /**
   * Buscar un paciente por ID
   * @param id - ID del paciente
   */
  async findOne(id: string): Promise<PacienteEntity> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['medicos', 'diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }
    return paciente;
  }

  /**
   * Crear un nuevo paciente
   * @param paciente - Datos del paciente
   */
  async create(paciente: PacienteEntity): Promise<PacienteEntity> {
    if (paciente.nombre.length < 3) {
      throw new BusinessLogicException(
        'El nombre del paciente debe tener al menos 3 caracteres',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.pacienteRepository.save(paciente);
  }

  /**
   * Eliminar un paciente por ID
   * @param id - ID del paciente
   */
  async delete(id: string) {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (paciente.diagnosticos.length > 0) {
      throw new BusinessLogicException(
        'No se puede eliminar un paciente que tiene diagnósticos asociados',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    await this.pacienteRepository.remove(paciente);
  }

  /**
   * Asignar un médico a un paciente
   * @param pacienteId - ID del paciente
   * @param medicoId - ID del médico
   */
  async addMedicoToPaciente(pacienteId: string, medicoId: string) {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id: medicoId },
    });
    if (!medico) {
      throw new BusinessLogicException(
        'El médico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    if (paciente.medicos.length >= 5) {
      throw new BusinessLogicException(
        'Un paciente no puede tener más de 5 médicos asignados',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    paciente.medicos.push(medico);
    await this.pacienteRepository.save(paciente);
  }
}
