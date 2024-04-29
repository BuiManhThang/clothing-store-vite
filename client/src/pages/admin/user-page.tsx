import { useQuery } from '@tanstack/react-query'
import baseApi from '../../api/baseApi'
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridPaginationModel,
  GridRowId,
} from '@mui/x-data-grid'
import { Box, Button, Icon, Paper } from '@mui/material'
import { Gender } from '../../enums'
import { User } from '../../types/user'
import { PaginationResult } from '../../types/pagination'
import { useMemo, useRef, useState } from 'react'

const getGenderName = (gender: Gender) => {
  switch (gender) {
    case Gender.Female:
      return 'Nữ'
    case Gender.Male:
      return 'Nam'
    default:
      return 'Khác'
  }
}

const UserPage = () => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 2,
  })

  const query = useQuery({
    queryKey: ['users', paginationModel.pageSize, paginationModel.page],
    queryFn: async () => {
      const res = await baseApi.get(
        `/users/pagination?pageSize=${paginationModel.pageSize}&pageIndex=${paginationModel.page}`
      )
      const paginationResult: PaginationResult<User> = res.data
      return paginationResult
    },
  })

  const rowCountRef = useRef(query.data?.totalRecord || 0)

  const rowCount = useMemo(() => {
    if (query.data?.totalRecord !== undefined) {
      rowCountRef.current = query.data.totalRecord
    }
    return rowCountRef.current
  }, [query.data?.totalRecord])

  const handleEditClick = (id: GridRowId) => {
    console.log(id)
  }

  const handleDeleteClick = (id: GridRowId) => {
    console.log(id)
  }

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'code',
        headerName: 'Mã',
        width: 150,
        editable: false,
        disableColumnMenu: true,
        sortable: false,
      },
      { field: 'name', headerName: 'Tên', minWidth: 150, flex: 1 },
      { field: 'email', headerName: 'Email', minWidth: 150, flex: 1 },
      { field: 'phoneNumber', headerName: 'Số điện thoại', width: 150 },
      {
        type: 'custom',
        field: 'gender',
        headerName: 'Giới tính',
        width: 150,
        renderCell: (params) => {
          return getGenderName(params.value)
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        width: 100,
        cellClassName: 'actions',
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={<Icon>edit</Icon>}
              label="Edit"
              className="textPrimary"
              onClick={() => handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<Icon>delete</Icon>}
              label="Delete"
              onClick={() => handleDeleteClick(id)}
              color="inherit"
            />,
          ]
        },
      },
    ],
    []
  )

  return (
    <Box height="100%">
      <Box display="flex" justifyContent="flex-end" pb={2}>
        <Button startIcon={<Icon>add</Icon>} variant="contained">
          Thêm mới
        </Button>
      </Box>
      <Paper
        elevation={2}
        sx={{
          height: 'calc(100% - 52.5px)',
          width: '1000px',
        }}
      >
        <DataGrid
          paginationModel={paginationModel}
          rowCount={rowCount}
          loading={query.isLoading}
          paginationMode="server"
          rows={query.data?.data || []}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          pageSizeOptions={[2, 5, 10, 25]}
          onPaginationModelChange={setPaginationModel}
        />
      </Paper>
    </Box>
  )
}

export default UserPage
