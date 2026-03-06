import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import type { Response } from 'express';

function sleep(time: number) {
  return new Promise((r) => setTimeout(r, time));
}

export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}

export class UpdateCatDto {
  name: string;
  age: number;
  breed: string;
}

// /cats
@Controller('cats')
export class CatsController {
  // Post 请求 Post localhost:cats/
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Post('create')
  async createCats(@Body() createCatDto: CreateCatDto) {
    await sleep(1000);
    return createCatDto;
  }

  // 表示带参数的url  ?id=xx
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    updateCatDto.name = id;
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }

  //  localhost:cats/text
  @Get()
  getJson(@Req() request: Request): any {
    const data = { user: 10, name: 'hello', url: request.url };
    return data;
  }

  // localhost:cats/text
  @Get('text')
  getText(): any {
    return 'get cats';
  }

  // 使用异步延迟请求
  @Get('find')
  async findAwait(): Promise<any[]> {
    await sleep(3000);
    return [];
  }

  @Get('Observable')
  findObservable(): Observable<any[]> {
    return of([]);
  }

  @Get('res')
  findRes(@Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.OK).json([]);
    return [];
  }
}
