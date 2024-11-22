/* archivo: src/medico-paciente/medico-paciente.service.ts */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from '../service/medico.entity/medico.entity';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../business-errors';

@Injectable()
export class MedicoPacienteService {
  constructor(
    @InjectRepository(MedicoEntity)
    private readonly medicoRepository: Repository<MedicoEntity>,
    
    @InjectRepository(PacienteEntity)
    private readonly pacienteRepository: Repository<PacienteEntity>,
  ) {}

  async addPacienteToMedico(medicoId: string, pacienteId: string): Promise<MedicoEntity> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id: pacienteId } });
    if (!paciente)
      throw new BusinessLogicException('The patient with the given id was not found', BusinessError.NOT_FOUND);

    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id: medicoId },
      relations: ['pacientes'],
    });
    if (!medico)
      throw new BusinessLogicException('The doctor with the given id was not found', BusinessError.NOT_FOUND);

    if (medico.pacientes.length >= 5)
      throw new BusinessLogicException('The doctor already has the maximum number of patients (5)', BusinessError.PRECONDITION_FAILED);

    medico.pacientes = [...medico.pacientes, paciente];
    return await this.medicoRepository.save(medico);
  }

  async findPacienteByMedicoIdAndPacienteId(medicoId: string, pacienteId: string): Promise<PacienteEntity> {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id: pacienteId } });
    if (!paciente)
      throw new BusinessLogicException('The patient with the given id was not found', BusinessError.NOT_FOUND);

    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id: medicoId },
      relations: ['pacientes'],
    });
    if (!medico)
      throw new BusinessLogicException('The doctor with the given id was not found', BusinessError.NOT_FOUND);

    const medicoPaciente: PacienteEntity = medico.pacientes.find((p) => p.id === paciente.id);
    if (!medicoPaciente)
      throw new BusinessLogicException('The patient with the given id is not associated to the doctor', BusinessError.PRECONDITION_FAILED);

    return medicoPaciente;
  }

  async findPacientesByMedicoId(medicoId: string): Promise<PacienteEntity[]> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id: medicoId },
      relations: ['pacientes'],
    });
    if (!medico)
      throw new BusinessLogicException('The doctor with the given id was not found', BusinessError.NOT_FOUND);

    return medico.pacientes;
  }

  async associatePacientesToMedico(medicoId: string, pacientes: PacienteEntity[]): Promise<MedicoEntity> {
    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id: medicoId },
      relations: ['pacientes'],
    });
    if (!medico)
      throw new BusinessLogicException('The doctor with the given id was not found', BusinessError.NOT_FOUND);

    if (pacientes.length > 5)
      throw new BusinessLogicException('A doctor cannot have more than 5 patients', BusinessError.PRECONDITION_FAILED);

    for (let i = 0; i < pacientes.length; i++) {
      const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id: pacientes[i].id } });
      if (!paciente)
        throw new BusinessLogicException('The patient with the given id was not found', BusinessError.NOT_FOUND);
    }

    medico.pacientes = pacientes;
    return await this.medicoRepository.save(medico);
  }

  async deletePacienteFromMedico(medicoId: string, pacienteId: string) {
    const paciente: PacienteEntity = await this.pacienteRepository.findOne({ where: { id: pacienteId } });
    if (!paciente)
      throw new BusinessLogicException('The patient with the given id was not found', BusinessError.NOT_FOUND);

    const medico: MedicoEntity = await this.medicoRepository.findOne({
      where: { id: medicoId },
      relations: ['pacientes'],
    });
    if (!medico)
      throw new BusinessLogicException('The doctor with the given id was not found', BusinessError.NOT_FOUND);

    const medicoPaciente: PacienteEntity = medico.pacientes.find((p) => p.id === paciente.id);
    if (!medicoPaciente)
      throw new BusinessLogicException('The patient with the given id is not associated to the doctor', BusinessError.PRECONDITION_FAILED);

    medico.pacientes = medico.pacientes.filter((p) => p.id !== pacienteId);
    await this.medicoRepository.save(medico);
  }
}
