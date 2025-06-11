import { ReactNode } from "react";

interface TableProps<T> {
  headers: ReactNode;
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  className?: string
  itemsStyle?: string
}

export function Table<T>({ headers, data, renderRow, className, itemsStyle }: TableProps<T>) {
  return (
    <div className={className}>
      <div className="flex justify-between w-full">
        {headers}
      </div>

      {/* Linhas */}

        {data.map((item, index) => (
          <div key={index} className={itemsStyle}>
            {renderRow(item, index)}
          </div>
        ))}

    </div>
  );
}
