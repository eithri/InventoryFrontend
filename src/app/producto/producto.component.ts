import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/model/Producto';
import { ProductoService } from '../service/producto.service';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  cols: any[] = [];
  items: MenuItem[] = [];
  displaySaveDialog: boolean = false;
  producto: Producto = new Producto();
  selectedProducto: Producto = new Producto();

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService,
    private confirmService: ConfirmationService
  ) {}

  getAll() {
    this.productoService.getAll().subscribe(
      (result: any) => {
        let productos: Producto[] = [];
        for (let i = 0; i < result.length; i++) {
          let producto = result[i] as Producto;
          productos.push(producto);
        }
        this.productos = productos;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showSaveDialog(editar: boolean) {
    if (editar) {
      if (this.selectedProducto != null && this.selectedProducto.id != null) {
        this.producto = this.selectedProducto;
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Atencion',
          detail: 'Selecciona el Producto que desees editar.',
        });
        return;
      }
    } else {
      this.producto = new Producto();
    }
    this.displaySaveDialog = true;
  }

  save() {
    if (this.producto.id == null) {
      this.productoService.save(this.producto).subscribe(
        (result: any) => {
          this.displaySaveDialog = false;
          this.productos.push(result);
          this.messageService.add({
            severity: 'success',
            summary: 'Resultado',
            detail: 'Se ha registrado el producto correctamente.',
          });
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.update(this.producto);
      this.displaySaveDialog = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Resultado',
        detail: 'Se ha actualizado el producto correctamente',
      });
    }
  }

  update(producto: Producto) {
    let index = this.productos.findIndex((e) => e.id == producto.id);
    if (index != -1) {
      this.productos[index] = producto;
      this.productoService.update(producto).subscribe();
    }
  }

  delete() {
    if (this.selectedProducto != null && this.selectedProducto.id != null) {
      this.confirmService.confirm({
        message: '¿Esta seguro que desea eliminar el producto?',
        accept: () => {
          if (this.selectedProducto.id != null) {
            this.productoService
              .delete(this.selectedProducto.id)
              .subscribe((result: any) => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Resultado',
                  detail: 'Se ha eliminado el registro Satisfactoriamente',
                });
                this.deleteObject(result.id);
              });
          }
        },
      });
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atencion',
        detail: 'Selecciona el Producto que desees editar.',
      });
    }
  }

  deleteObject(id: number) {
    let index = this.productos.findIndex((e) => e.id == id);
    if (index != -1) {
      this.productos.splice(index, 1);
    }
  }

  ngOnInit() {
    this.getAll();
    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Nombre' },
      { field: 'price', header: 'Precio' },
      { field: 'stock', header: 'Stock' },
    ];

    this.items = [
      {
        label: 'Nuevo',
        icon: 'pi pi-fw pi-plus',
        command: () => this.showSaveDialog(false),
      },
      {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.showSaveDialog(true),
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-fw pi-trash',
        command: () => this.delete(),
      },
    ];
  }
}
