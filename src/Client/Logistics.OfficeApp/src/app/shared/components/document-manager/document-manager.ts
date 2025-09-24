import {Component, EventEmitter, Input, Output, inject, signal, OnInit, input, output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TableModule} from "primeng/table";
import {FileUploadModule} from "primeng/fileupload";
import {TagModule} from "primeng/tag";
import {ToastModule} from "primeng/toast";
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {TooltipModule} from "primeng/tooltip";
import {ApiService} from "@/core/api";
import {DocumentDto, DocumentStatus, DocumentType, DocumentOwnerType, UploadDocumentRequest} from "@/core/api/models";
import {ToastService} from "@/core/services";
import { downloadBlobFile } from "@/shared/utils/file-download.utils";

@Component({
  selector: "app-document-manager",
  standalone: true,
  imports: [CommonModule, ButtonModule, TableModule, FileUploadModule, TagModule, ToastModule, CardModule, DividerModule, ProgressSpinnerModule, TooltipModule],
  templateUrl: "./document-manager.html",
  styleUrls: ["./document-manager.css"]
})
export class DocumentManagerComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  readonly employeeId = input<string>();
  readonly loadId = input<string>();
  readonly types = input<DocumentType[]>([]);

  readonly changed = output<void>();

  protected readonly isLoading = signal(false);
  protected readonly rows = signal<DocumentDto[]>([]);
  protected readonly uploadProgress = signal<{[key: string]: number}>({});

  ngOnInit(): void {
    this.refresh();
  }

  protected refresh(): void {
    this.isLoading.set(true);
    const query: any = {};
    
    if (this.employeeId()) {
      query.ownerType = DocumentOwnerType.Employee;
      query.ownerId = this.employeeId();
    } else if (this.loadId()) {
      query.ownerType = DocumentOwnerType.Load;
      query.ownerId = this.loadId();
    }

    this.api.documentApi
      .getDocuments(query)
      .subscribe((result) => {
        if (result.success) {
          this.rows.set(result.data || []);
        }
        this.isLoading.set(false);
      });
  }

  protected onFileChange(event: Event, type: DocumentType): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      this.upload(files[0], type);
    }
    input.value = ""; // reset
  }

  protected upload(file: File, type: DocumentType): void {
    if (file.size > 50 * 1024 * 1024) {
      this.toast.showError("File exceeds 50MB limit");
      return;
    }
    

    const ownerType = this.employeeId() ? DocumentOwnerType.Employee : DocumentOwnerType.Load;
    const ownerId = this.employeeId() || this.loadId() || "";


    const request: UploadDocumentRequest = {
      ownerType,
      ownerId,
      file,
      type,
      description: `${type} document`
    };

    this.uploadProgress.set({[type]: 0});

    this.api.documentApi.uploadDocument(request).subscribe({
      next: (result) => {
        if (result.success) {
          this.toast.showSuccess(`${type} uploaded successfully`);
          this.refresh();
          this.changed.emit();
        }
        this.uploadProgress.set({[type]: 100});
      },
      error: () => {
        this.toast.showError(`Failed to upload ${type}`);
        this.uploadProgress.set({[type]: 0});
      }
    });
  }

  protected download(row: DocumentDto): void {
    this.api.documentApi.downloadFile(row.id).subscribe({
      next: (blob) => {
        const fileName = row.originalFileName || row.fileName;
        downloadBlobFile(blob, fileName); 
      },
      error: () => {
        this.toast.showError("Failed to download file");
      }
    });
  }

  protected delete(row: DocumentDto): void {
    console.log(row);
    if (confirm(`Are you sure you want to delete "${row.fileName}"?`)) {

      this.api.documentApi.deleteDocument(row.id).subscribe({
        next: (result) => {
          if (result.success) {
            this.toast.showSuccess("Document deleted successfully");
            this.refresh();
            this.changed.emit();
          }
        },
        error: () => {
          this.toast.showError("Failed to delete document");
        }
      });
    }
  }

  protected statusSeverity(status: DocumentStatus): string {
    switch (status) {
      case DocumentStatus.Active:
        return "success";
      case DocumentStatus.Archived:
        return "warning";
      case DocumentStatus.Deleted:
        return "danger";
      default:
        return "info";
    }
  }

  protected formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  protected getTypeLabel(type: DocumentType): string {
    return type.replace(/([A-Z])/g, " $1").trim();
  }
}