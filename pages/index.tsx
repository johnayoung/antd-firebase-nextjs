import React, { useRef, useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Tag, Space } from "antd";
import ProTable, {
  ProColumns,
  TableDropdown,
  ActionType,
} from "@ant-design/pro-table";
import { useUser } from "../context/userContext";
import firebase from "../firebase/clientApp";

import MainLayout from "../layouts/main";

const columns = [
  {
    title: "序号",
    dataIndex: "index",
    valueType: "indexBorder",
    width: 72,
  },
  {
    title: "标题",
    dataIndex: "title",
    copyable: true,
    ellipsis: true,
    rules: [
      {
        required: true,
        message: "此项为必填项",
      },
    ],
    width: "30%",
    hideInSearch: true,
  },
  {
    title: "状态",
    dataIndex: "state",
    initialValue: "all",
    valueEnum: {
      all: { text: "全部", status: "Default" },
      open: {
        text: "未解决",
        status: "Error",
      },
      closed: {
        text: "已解决",
        status: "Success",
      },
      processing: {
        text: "解决中",
        status: "Processing",
      },
    },
    width: "10%",
  },
  {
    title: "标签",
    dataIndex: "labels",
    width: "10%",
    render: (_, row) => (
      <Space>
        {row.labels.map(({ name, id, color }) => (
          <Tag color={color} key={id}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: "创建时间",
    key: "since",
    dataIndex: "created_at",
    valueType: "dateTime",
    width: "20%",
  },
  {
    title: "操作",
    valueType: "option",
    render: (text, row, _, action) => [
      <a href={row.html_url} target="_blank" rel="noopener noreferrer">
        链路
      </a>,
      <a href={row.html_url} target="_blank" rel="noopener noreferrer">
        报警
      </a>,
      <a href={row.html_url} target="_blank" rel="noopener noreferrer">
        查看
      </a>,
      <TableDropdown
        onSelect={() => action.reload()}
        menus={[
          { key: "copy", name: "复制" },
          { key: "delete", name: "删除" },
        ]}
      />,
    ],
  },
];

export default function Home() {
  const actionRef = useRef();
  const [visible, setVisible] = useState(false);

  // Our custom hook to get context values
  const { loadingUser, user } = useUser();

  useEffect(() => {
    if (!loadingUser) {
      // You know that the user is loaded: either logged in or out!
      console.log(user);
    }
    // You also have your firebase app initialized
    console.log(firebase);
  }, [loadingUser, user]);
  return (
    <MainLayout>
      <div
        style={{
          background: "#f5f5f5",
          margin: -24,
          padding: 24,
        }}
      >
        <Drawer width={600} onClose={() => setVisible(false)} visible={visible}>
          <Button
            style={{
              margin: 8,
            }}
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }}
          >
            刷新
          </Button>
          <Button
            onClick={() => {
              if (actionRef.current) {
                actionRef.current.reset();
              }
            }}
          >
            重置
          </Button>
          <ProTable<GithubIssueItem>
            columns={columns}
            type="form"
            onSubmit={(params) => console.log(params)}
          />
        </Drawer>
        <ProTable<GithubIssueItem>
          columns={columns}
          actionRef={actionRef}
          request={async (params = {}) =>
            request<{
              data: GithubIssueItem[];
            }>("https://proapi.azurewebsites.net/github/issues", {
              params,
            })
          }
          rowKey="id"
          dateFormatter="string"
          headerTitle="高级表格"
          toolBarRender={() => [
            <Button key="3" type="primary">
              <PlusOutlined />
              新建
            </Button>,
          ]}
        />
      </div>
    </MainLayout>
  );
}
