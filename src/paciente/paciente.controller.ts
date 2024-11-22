/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { PacienteService } from './paciente.service';
import { PacienteDto } from './paciente.dto/paciente.dto';
import { PacienteEntity } from '../service/paciente.entity/paciente.entity';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  /**
   * Obtener todos los pacientes
   */
  @Get()
  async findAll() {
    return await this.pacienteService.findAll();
  }

  /**
   * Obtener un paciente por ID
   * @param id - ID del paciente
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.pacienteService.findOne(id);
  }

  /**
   * Crear un nuevo paciente
   * @param pacienteDto - Datos del paciente
   */
  @Post()
  async create(@Body() pacienteDto: PacienteDto) {
    const paciente: PacienteEntity = plainToInstance(PacienteEntity, pacienteDto);
    return await this.pacienteService.create(paciente);
  }

  /**
   * Actualizar un paciente por ID
   * @param id - ID del paciente
   * @param pacienteDto - Nuevos datos del paciente
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() pacienteDto: PacienteDto) {
    const paciente: PacienteEntity = plainToInstance(PacienteEntity, pacienteDto);
    return await this.pacienteService.update(id, paciente);
  }

  /**
   * Eliminar un paciente por ID
   * @param id - ID del paciente
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.pacienteService.delete(id);
  }

  /**
   * Asignar un médico a un paciente
   * @param pacienteId - ID del paciente
   * @param medicoId - ID del médico
   */
  @Post(':pacienteId/medicos/:medicoId')
  async addMedicoToPaciente(@Param('pacienteId') pacienteId: string, @Param('medicoId') medicoId: string) {
    return await this.pacienteService.addMedicoToPaciente(pacienteId, medicoId);
  }
}
