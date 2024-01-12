import PropTypes from "prop-types";
import { Table } from "flowbite-react";
import { siteData } from "../config/siteData";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Results({ profileFilters, selectedAreas }) {
  const [sites, setSites] = useState(null);
  const navigate = useNavigate();
  const headers = [
    "area",
    "site",
    "# fits profile",
    "% fits profile",
    "company",
  ];
  useEffect(() => {
    const filter = profileFilters || [];
    const areas = selectedAreas || [];

    if (filter.length === 0 && areas.length === 0) {
      setSites([]);
      return;
    }
    setSites(
      siteData
        .filter((data) => {
          if (areas.length > 0) {
            return areas.find((result) => result.area === data.area);
          } else {
            return data;
          }
        })
        .filter((data) => {
          return (
            filter.length === 0 ||
            filter.some((filter) => {
              const category = filter.category;
              const key = filter.key;
              const value = filter.value;
              const demographics = data.demographics;

              return value === demographics[category][key];
            })
          );
        })
    );
  }, [profileFilters, selectedAreas]);

  return (
    sites && (
      <div className="overflow-x-auto">
        <Table className="border bg-white rounded-md w-full">
          <Table.Head className="shadow-md">
            {headers.map((header, index) => {
              return (
                <Table.HeadCell key={index} className="text-main">
                  {header}
                </Table.HeadCell>
              );
            })}
          </Table.Head>
          <Table.Body>
            {sites.length !== 0 ? (
              sites.map((item, index) => {
                const count = 100 - (13 * (index + 1.382)) / 4;
                return (
                  <Table.Row
                    key={index}
                    className="hover:bg-slate-200 transition-all cursor-pointer"
                    onClick={() => {
                      localStorage.setItem("location", item.site);
                      navigate(`/audience/${item.site}`);
                    }}
                  >
                    <Table.Cell className="text-main whitespace-nowrap">
                      <p className="font-semibold text-lg ">{item.area}</p>
                      <p>{item.region}</p>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="flex flex-col whitespace-nowrap">
                        <span>{item.site}</span>
                        <span>
                          Avg Monthly Impressions: {Math.round(count * 2.43)}
                        </span>
                      </p>
                    </Table.Cell>
                    <Table.Cell>{Math.round(count * 2.12)}</Table.Cell>
                    <Table.Cell>{Math.round(count)}%</Table.Cell>
                    <Table.Cell>UNAI</Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={headers.length} align="center">
                  Results not available
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    )
  );
}

Results.propTypes = {
  selectedAreas: PropTypes.array,
  profileFilters: PropTypes.object,
};

export default Results;
