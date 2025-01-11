import { fetchCSVPreview } from "@/lib/s3-client";

import { useContext, useState } from "react";
import { PreviewButton } from "./PreviewButton";
import { PreviewModal } from "./PreviewModal";
import { CSVPreviewData, FileMetadata, PreviewError } from "@/lib/types/csv";
import AppContext from "../context/AppContext";
import SnackbarUi from "../layout/UI/SnackbarUi";

interface CSVPreviewProps {
    bucket: string;
    s3Key: string;
  }
export const CSVPreview: React.FC<CSVPreviewProps> = ({ bucket, s3Key }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<PreviewError | null>(null);
    const [previewData, setPreviewData] = useState<CSVPreviewData | null>(null);
    const [metadata, setMetadata] = useState<FileMetadata | null>(null);
    const {open,setOpen} = useContext(AppContext);
    const [openSnackbar,setOpenSnackBar]=useState(true)
 
    const handlePreviewClick = async () => {
   
      setIsLoading(true);
      setError(null);
      setOpenSnackBar(true)
      try {
        const { data, metadata } = await fetchCSVPreview(bucket, s3Key);
        setPreviewData(data);
        setMetadata(metadata);
        setIsModalOpen(true);
      } catch (err) {
        setError(err as PreviewError);
      } finally {
        setIsLoading(false);
      }
      setOpen(false);
    };
  
    return (
      <div>
        <PreviewButton
          onClick={handlePreviewClick}
          isLoading={isLoading}
          disabled={isLoading}
        />
  
        {error && (
          // <div className="mt-2 text-sm text-red-600" role="alert">
          //   {error.message}
          //   {error.code && ` (${error.code})`}
          // </div>
          <>
          <SnackbarUi open={openSnackbar} setOpen={setOpenSnackBar}/>
          </>
        )}
  
        {previewData && metadata && (
          <PreviewModal
            isOpen={isModalOpen}
            onClose={() => {setIsModalOpen(false)
              setOpen(true)}}
            data={previewData}
            metadata={metadata}
          />
        )}
      </div>
    );
  };