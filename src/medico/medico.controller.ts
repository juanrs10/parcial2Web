/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { MedicoService } from './medico.service';
import { MedicoDto } from './medico.dto/medico.dto';
import { MedicoEntity } from '../service/medico.entity/medico.entity';

@Controller('medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  /**
   * Obtener todos los médicos
   */
  @Get()
  async findAll() {
    return await this.medicoService.findAll();
  }

  /**
   * Obtener un médico por ID
   * @param id - ID del médico
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.medicoService.findOne(id);
  }

  /**
   * Crear un nuevo médico
   * @param medicoDto - Datos del médico
   */
  @Post()
  async create(@Body() medicoDto: MedicoDto) {
    const medico: MedicoEntity = plainToInstance(MedicoEntity, medicoDto);
    return await this.medicoService.create(medico);
  }

  /**
   * Actualizar un médico por ID
   * @param id - ID del médico
   * @param medicoDto - Nuevos datos del médico
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() medicoDto: MedicoDto) {
    const medico: MedicoEntity = plainToInstance(MedicoEntity, medicoDto);
    return await this.medicoService.update(id, medico);
  }

  /**
   * Eliminar un médico por ID
   * @param id - ID del médico
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.medicoService.delete(id);
  }
}
