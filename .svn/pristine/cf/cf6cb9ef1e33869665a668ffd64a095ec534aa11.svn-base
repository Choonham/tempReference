import React, {useState} from 'react';
import {getCoreRowModel, getPaginationRowModel, useReactTable} from '@tanstack/react-table';

const StatisticsGridComponent = ({columns, data, needPaging, selectedRowIds, setSelectedRowIds}) => {
    const [pageIndex, setPageIndex] = useState(0);
    const pageSize = 10;
    const [isDragging, setIsDragging] = useState(false);
    /*const [selectedRowIds, setSelectedRowIds] = useState([]);*/

    const tableSet = needPaging ? {
        data,
        columns,
        state: {
            pagination: {
                pageIndex,
                pageSize,
            },
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    } : {
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    };

    const table = useReactTable(tableSet);

    const handleMouseDown = (rowId, event) => {
        event.preventDefault();
        if (selectedRowIds.includes(rowId)) {
            setSelectedRowIds(selectedRowIds.filter((e) => e !== rowId));
            return;
        }
        /*setIsDragging(true);*/
        setSelectedRowIds([...selectedRowIds, rowId]);
    };

    const handleMouseEnter = (rowId) => {
      /*  if (isDragging) {
            setSelectedRowIds((prev) => [...new Set([...prev, rowId])]);
        }*/
    };

    const handleMouseUp = () => {
        /*setIsDragging(false);*/
    };

    const clearSelection = () => {
        setSelectedRowIds([]);
    };

    return (
        <div className="statistic_table_wrapper">
            <table className="statistic_table">
                <thead className="statistic_thead">
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th className="th" key={header.id}>{header.column.columnDef.header}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody onMouseUp={handleMouseUp}>
                {table.getRowModel().rows.map(row => (
                    <tr
                        key={row.id}
                        className={`tr ${selectedRowIds.includes(row.id) ? 'active' : ''}`}
                        /*onClick={() => handleRowClick(row.id)}*/
                        onMouseDown={(e) => handleMouseDown(row.id, e)}
                        onMouseEnter={() => handleMouseEnter(row.id)}
                    >
                        {row.getVisibleCells().map(cell => (
                            <td className={`td ${cell.column.id === 'time' ? 'time-column' : ''}`} key={cell.id}>{cell.getValue()}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            {
                needPaging ? (
                    <div className="paging-controls">
                        <span className="paging-text" style={{color: 'black'}}>
                            Page {pageIndex + 1} of {table.getPageCount()}
                        </span>
                        <button
                            className="paging-button"
                            onClick={() => setPageIndex(old => Math.max(old - 1, 0))}
                            disabled={pageIndex === 0}
                        >                            이전
                        </button>
                        <button
                            className="paging-button"
                            onClick={() => setPageIndex(old => (old + 1 < table.getPageCount() ? old + 1 : old))}
                            disabled={pageIndex + 1 >= table.getPageCount()}
                        >
                            다음
                        </button>
                    </div>
                ) : ('')
            }
        </div>
    );
};

export default StatisticsGridComponent;
