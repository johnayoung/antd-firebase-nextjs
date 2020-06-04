import React, { useRef, useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Drawer, Tag, Space } from "antd";
import ProTable, {
  enUSIntl,
  IntlProvider,
  ProColumns,
  TableDropdown,
  ActionType,
} from "@ant-design/pro-table";
import { useUser } from "../context/userContext";
import { sortingComparators } from "../utils/arrays";
import firebase from "../firebase/clientApp";

import MainLayout from "../layouts/main";

const columns = [
  {
    title: "imageUrl",
    dataIndex: "imageUrl",
    valueType: "avatar",
    renderText: (text) => {
      const baseUrl = `https://data.project-ascension.com`;
      return baseUrl + text;
    },
  },
  {
    title: "name",
    dataIndex: "name",
    valueType: "text",
  },
  {
    title: "requiredLevel",
    dataIndex: "requiredLevel",
    valueType: "digit",
    sorter: sortingComparators("requiredLevel").digit,
  },
  {
    title: "talentEssenceCost",
    dataIndex: "talentEssenceCost",
    valueType: "digit",
    sorter: sortingComparators("talentEssenceCost").digit,
  },
  // {
  //   title: "标题",
  //   dataIndex: "title",
  //   copyable: true,
  //   ellipsis: true,
  //   rules: [
  //     {
  //       required: true,
  //       message: "此项为必填项",
  //     },
  //   ],
  //   width: "30%",
  //   hideInSearch: true,
  // }
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
      <IntlProvider value={enUSIntl}>
        <div
          style={{
            background: "#f5f5f5",
            margin: -24,
            padding: 24,
          }}
        >
          <Drawer
            width={600}
            onClose={() => setVisible(false)}
            visible={visible}
          >
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
            request={async (params, sort, filter) => {
              const db = firebase.firestore();
              const response = await db.collection("abilities").get();

              let data = [];
              response.forEach(function (doc) {
                const item = doc.data();
                data.push(item);
              });

              console.log(data);

              return { data, success: true };
            }}
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
      </IntlProvider>
    </MainLayout>
  );
}
