interface FileLocationOptions {
    preserveStructure?: boolean;
    basePrefix?: string;
    useTimestamp?: boolean;
  }
  
  export class FilePathHandler {
    private getLocalPathStructure(file: File): string {
      // Get the full path if available (works in Chrome)
      const path = (file as any).webkitRelativePath || '';
      
      // If no relative path, try to get it from input element
      if (!path) {
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (input?.files?.[0]) {
          const fullPath = input.value;
          return fullPath.replace(/\\/g, '/');  // Convert Windows backslashes to forward slashes
        }
      }
      
      return path;
    }
  
    private sanitizePath(path: string): string {
      return path
        .toLowerCase()
        .replace(/[^a-z0-9/.-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^[a-z]:\//i, ''); // Remove drive letter prefix (e.g., "C:/")
    }
  
    generateS3Path(file: File, options: FileLocationOptions = {}): {
      s3Key: string;
      sourceLocation: string;
    } {
      const {
        preserveStructure = true,
        basePrefix = 'uploads',
        useTimestamp = true
      } = options;
  
      // Get the local file path
      const localPath = this.getLocalPathStructure(file);
      const sourceLocation = localPath || 'Unknown Location';
  
      // Initialize path components
      const pathComponents: string[] = [basePrefix];
  
      // Add timestamp if enabled
      if (useTimestamp) {
        const date = new Date();
        pathComponents.push(
          date.getFullYear().toString(),
          (date.getMonth() + 1).toString().padStart(2, '0')
        );
      }
  
      if (preserveStructure && localPath) {
        // Extract directory structure without drive letter
        const dirStructure = this.sanitizePath(localPath);
        
        // Get the directory path without the filename
        const dirPath = dirStructure.split('/').slice(0, -1).join('/');
        
        if (dirPath) {
          pathComponents.push(dirPath);
        }
      }
  
      // Add sanitized filename
      const fileName = this.sanitizePath(file.name);
      pathComponents.push(fileName);
  
      // Combine all components
      const s3Key = pathComponents
        .filter(Boolean)
        .join('/')
        .replace(/\/+/g, '/'); // Remove any double slashes
  
      return {
        s3Key: `/${s3Key}`,
        sourceLocation
      };
    }
  
    // Helper method to extract meaningful location info
    getLocationInfo(file: File): string {
      const path = this.getLocalPathStructure(file);
      if (!path) return 'Unknown Location';
  
      // Try to extract drive and folder structure
      const parts = path.split(/[/\\]/);
      if (parts[0].match(/^[A-Z]:/i)) {
        // Windows path with drive letter
        return `${parts[0]} → ${parts.slice(1, -1).join('/')}`;
      }
      
      return parts.slice(0, -1).join('/');
    }
  }