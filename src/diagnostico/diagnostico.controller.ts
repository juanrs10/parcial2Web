/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoDto } from './diagnostico.dto/diagnostico.dto';
import { DiagnosticoEntity } from '../service/diagnostico.entity/diagnostico.entity';

@Controller('diagnosticos')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  /**
   * Obtener todos los diagnósticos
   */
  @Get()
  async findAll() {
    return await this.diagnosticoService.findAll();
  }

  /**
   * Obtener un diagnóstico por ID
   * @param id - ID del diagnóstico
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.diagnosticoService.findOne(id);
  }

  /**
   * Crear un nuevo diagnóstico
   * @param diagnosticoDto - Datos del diagnóstico
   */
  @Post()
  async create(@Body() diagnosticoDto: DiagnosticoDto) {
    const diagnostico: DiagnosticoEntity = plainToInstance(DiagnosticoEntity, diagnosticoDto);
    return await this.diagnosticoService.create(diagnostico);
  }

  /**
   * Actualizar un diagnóstico por ID
   * @param id - ID del diagnóstico
   * @param diagnosticoDto - Nuevos datos del diagnóstico
   */
  @Put(':id')
  async update(@Param('id') id: string, @Body() diagnosticoDto: DiagnosticoDto) {
    const diagnostico: DiagnosticoEntity = plainToInstance(DiagnosticoEntity, diagnosticoDto);
    return await this.diagnosticoService.update(id, diagnostico);
  }

  /**
   * Eliminar un diagnóstico por ID
   * @param id - ID del diagnóstico
   */
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.diagnosticoService.delete(id);
  }
}
