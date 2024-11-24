import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import styled from "@emotion/styled";
import { Theme as MuiTheme } from "@mui/material/styles";

export const StyledTableRow = styled(TableRow)<{ theme?: MuiTheme, tableHead: boolean }>(({ theme, tableHead = false }) => ({
    cursor: tableHead ? "auto" : "pointer",
    transition: "background-color 0.2s",
    borderSpacing: 0,
    borderCollapse: "collapse",
    '& .MuiTableCell-root': {
        borderBottom: `1px solid ${theme?.palette?.divider}`,
        padding: "16px",
        borderCollapse: "collapse",
        margin: 0,
    }
}));


export const StyledTableBody = styled(TableBody)<{ theme?: MuiTheme }>(({ theme }) => ({
    '& .MuiTableRow-root': {
        cursor: "pointer",
        transition: "all 0.2s ease-in-out", // Smooth transition for all properties
        position: "relative",
        
        // Zebra striping for better readability
        '&:nth-of-type(even)': {
            backgroundColor: theme?.palette?.action?.hover || 'rgba(0, 0, 0, 0.02)',
        },

        // Modern hover effect
        '&:hover': {
            backgroundColor: theme?.palette?.action?.hover || 'rgba(0, 0, 0, 0.04)',
            transform: 'translateX(4px)', // Slight shift on hover
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)', // Subtle shadow on hover
        },

        // Cell styling
        '& .MuiTableCell-root': {
            borderBottom: `1px solid ${theme?.palette?.divider}`,
            padding: "16px",
            fontSize: '0.875rem',
            lineHeight: '1.5',
            
            // First cell (title) styling
            '&:first-of-type': {
                fontWeight: 500,
                color: theme?.palette?.text?.primary,
            },

            // Last cell (actions) styling
            '&:last-child': {
                textAlign: 'right',
                '& .MuiButtonBase-root': {
                    opacity: 0.7,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                        opacity: 1
                    }
                }
            }
        },

        // Row spacing
        marginBottom: '4px',
        
        // Optional: Row border radius for modern look
        borderRadius: '4px',
        overflow: 'hidden',
        
        // Optional: Status indication (if todos have status)
        '&.completed': {
            backgroundColor: theme?.palette?.success?.light || '#e8f5e9',
            opacity: 0.8
        }
    }
}));

export const StyledTableHead = styled(TableHead)<{ theme?: MuiTheme }>(({ theme }) => ({
    marginBottom: "16px",
    '& .MuiTableCell-root': {
        borderBottom: `2px solid ${theme?.palette?.divider}`,
        padding: "16px",
        fontWeight: "bold",
        // borderCollapse: "collapse",
        // '&::after': {
        //     content: "''",
        //     display: "block",
        //     height: "8px"
        // }
    },
}));



export const StyledTable = styled(Table)({
    // width: "100%",
    width: "auto",
    borderCollapse: "collapse",
    // borderSpacing: "0 8px",
    tableLayout: "fixed",
});