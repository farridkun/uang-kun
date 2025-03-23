import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useCSVReader } from 'react-papaparse'

type CSVResult = {
  data: any[];
  errors: any[];
  meta: Record<string, any>;
}

type Props = {
  onUpload: (data: CSVResult) => void;
}

// Define type for getRootProps
type CSVReaderRenderProps = {
  getRootProps: () => Record<string, any>;
  acceptedFile: File | null;
  ProgressBar: React.ReactNode;
  getRemoveFileProps: () => Record<string, any>;
  Remove: React.ReactNode;
  FileInput: React.ReactNode;
}

export const UploadButton = ({ onUpload }: Props) => {
  const { CSVReader } = useCSVReader()

  // TODO: Add pay wall

  return (
    <CSVReader
      onUploadAccepted={(result: CSVResult) => {
        onUpload(result);
      }}
    >
      {({ getRootProps }: CSVReaderRenderProps) => (
        <Button
          size='sm'
          className="w-full lg:w-auto"
          {...getRootProps()}
        >
          <Upload className="size-4 mr-2" />
          Import
        </Button>
      )}
    </CSVReader>
  )
}
