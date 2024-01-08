import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ModelsService {
    private prisma = new PrismaClient();

    async findAll(): Promise<any[]> {
        return this.prisma.model.findMany({
            include: {
                brand: true,
            },
        });    
    }

    async findModelsByBrandEndpoint(brandName: string): Promise<any | null> {
        return this.prisma.model.findMany({
            include: {
                brand: true,
            },
            where: {
                brand: {
                    name: brandName,
                },
            },
        });
    }

    async findModelsByIdEndpoint(id: string): Promise<any | null> {
        return this.prisma.model.findUnique({
            where: {
                id,
            },
        });
    }

    async addModelEndpoint(brandName: string, modelName: string): Promise<any> {
        const existingModel = await this.prisma.model.findUnique({
            where: {
                name: modelName,
            },
        });
    
        if (existingModel) {
            throw new ConflictException(`Model with name ${modelName} already exists.`);
        }

        const brand = await this.prisma.brand.findUnique({
            where: {
                name: brandName,
            },
        });

        if (!brand) {
            throw new NotFoundException(`Brand with name ${brandName} not found.`);
        }

        return this.prisma.model.create({
            data: {
                name: modelName,
                brand: {
                    connect: {
                        id: brand.id,
                    },
                },
            },
        });
    }

    async deleteModelEndpoint(id: string): Promise<any> {
        return this.prisma.model.delete({
            where: {
                id,
            },
        });
    }
}
