/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from '../service/diagnostico.entity/diagnostico.entity';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';
import { BusinessError, BusinessLogicException } from '../business-errors';

@Injectable()
export class DiagnosticoPacienteService {
  constructor(
    @InjectRepository(DiagnosticoEntity)
    private readonly diagnosticoRepository: Repository<DiagnosticoEntity>,

    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  /**
   * Asociar un diagnóstico a un paciente
   * @param pacienteId - ID del paciente
   * @param diagnosticoId - ID del diagnóstico
   */
  async addDiagnosticoToPaciente(pacienteId: string, diagnosticoId: string): Promise<PacienteEntity> {
    const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({ where: { id: diagnosticoId } });
    if (!diagnostico) {
      throw new BusinessLogicException(
        'El diagnóstico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    paciente.diagnosticos.push(diagnostico);
    return await this.pacienteRepository.save(paciente);
  }

  /**
   * Obtener un diagnóstico asociado a un paciente
   * @param pacienteId - ID del paciente
   * @param diagnosticoId - ID del diagnóstico
   */
  async findDiagnosticoByPacienteIdDiagnosticoId(pacienteId: string, diagnosticoId: string): Promise<DiagnosticoEntity> {
    const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({ where: { id: diagnosticoId } });
    if (!diagnostico) {
      throw new BusinessLogicException(
        'El diagnóstico con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const pacienteDiagnostico = paciente.diagnosticos.find((d) => d.id === diagnostico.id);
    if (!pacienteDiagnostico) {
      throw new BusinessLogicException(
        'El diagnóstico con el ID proporcionado no está asociado al paciente',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return pacienteDiagnostico;
  }

  /**
   * Obtener todos los diagnósticos asociados a un paciente
   * @param pacienteId - ID del paciente
   */
  async findDiagnosticosByPacienteId(pacienteId: string): Promise<DiagnosticoEntity[]> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    return paciente.diagnosticos;
  }

  /**
   * Asociar diagnósticos a un paciente
   * @param pacienteId - ID del paciente
   * @param diagnosticos - Lista de diagnósticos
   */
  async associateDiagnosticosToPaciente(pacienteId: string, diagnosticos: DiagnosticoEntity[]): Promise<PacienteEntity> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    for (const diagnostico of diagnosticos) {
      const diagnosticoEntity: DiagnosticoEntity = await this.diagnosticoRepository.findOne({ where: { id: diagnostico.id } });
      if (!diagnosticoEntity) {
        throw new BusinessLogicException(
          `El diagnóstico con el ID ${diagnostico.id} no fue encontrado`,
          BusinessError.NOT_FOUND,
        );
      }
    }

    paciente.diagnosticos = diagnosticos;
    return await this.pacienteRepository.save(paciente);
  }

  /**
   * Eliminar un diagnóstico de un paciente
   * @param pacienteId - ID del paciente
   * @param diagnosticoId - ID del diagnóstico
   */
  async deleteDiagnosticoFromPaciente(pacienteId: string, diagnosticoId: string) {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['diagnosticos'],
    });
    if (!paciente) {
      throw new BusinessLogicException(
        'El paciente con el ID proporcionado no fue encontrado',
        BusinessError.NOT_FOUND,
      );
    }

    const diagnostico: DiagnosticoEntity = paciente.diagnosticos.find((d) => d.id === diagnosticoId);
    if (!diagnostico) {
      throw new BusinessLogicException(
        'El diagnóstico con el ID proporcionado no está asociado al paciente',
        BusinessError.PRECONDITION_FAILED,
      );
    }

    paciente.diagnosticos = paciente.diagnosticos.filter((d) => d.id !== diagnosticoId);
    await this.pacienteRepository.save(paciente);
  }
}
