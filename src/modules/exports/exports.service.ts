import { Injectable, StreamableFile } from '@nestjs/common';
import * as Excel from 'exceljs';
import { Ticket } from '../tickets/entities';
import { TicketToRowExcelDto } from './dto';

@Injectable()
export class ExportsService {
  async exportReport(tickets: Ticket[]) {
    try {
      const workbook = new Excel.Workbook();
      const worksheet = workbook.addWorksheet('Reports');
      worksheet.columns = [
        { header: 'Id', key: 'id', width: 25 },
        { header: 'Title', key: 'title', width: 30 },
        { header: 'Description', key: 'description', width: 50 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Created by', key: 'created_by', width: 20 },
        { header: 'Created at', key: 'created_at', width: 15 },
        { header: 'Updated at', key: 'updated_at', width: 15 },
        { header: 'Area', key: 'area', width: 25 },
        { header: 'Location', key: 'location', width: 15 },
        { header: 'Map', key: 'location_map_link', width: 15 },
        { header: 'Images', key: 'images', width: 20 },
        { header: 'Link', key: 'link', width: 20 },
      ];
      const data = tickets.map((v) => new TicketToRowExcelDto(v));
      worksheet.addRows(data);
      const buffer = await workbook.xlsx.writeBuffer({
        filename: `reports_${Date.now()}.xlsx`,
      });
      return new StreamableFile(Buffer.from(buffer));
    } catch (error) {
      throw error;
    }
  }
}
