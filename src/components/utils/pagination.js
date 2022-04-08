import PropTypes from "prop-types";
import React, { Component } from "react";
import Variables from "../../variables";

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.createLink = this.createLink.bind(this);
  }
  createLink(pageNum) {
    return (
      <a
        onClick={() =>
          this.props.changePage((pageNum - 1) * Variables.PAGE_SIZE)
        }
      >
        {pageNum}
      </a>
    );
  }

  render() {
    const { pagination } = this.props;
    const current_page_buffer = 3; // how many results to show on either side of the current page

    let total_pages = Math.ceil(pagination.count / Variables.PAGE_SIZE);
    let current_page = Math.floor(pagination.offset / Variables.PAGE_SIZE) + 1;
    let range_start = Math.max(current_page - current_page_buffer, 1);
    let range_end = Math.min(current_page + current_page_buffer, total_pages);
    let links_array = [];

    for (let i = range_start; i <= range_end; i++) {
      links_array.push(i);
    }
    while (
      links_array.length <= current_page_buffer * 2 &&
      (links_array[links_array.length - 1] < total_pages || links_array[0] > 1)
    ) {
      // pad out pagination links if near the beginning or end
      range_start === 1
        ? links_array.push(links_array.length + 1)
        : links_array.unshift(links_array[0] - 1);
    }

    if (total_pages > 1) {
      // only show pagination if there's more than one page
      return (
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={current_page === 1 && "disabled"}>
              {current_page !== 1 ? (
                <a
                  aria-label="Previous"
                  onClick={() =>
                    this.props.changePage(
                      (current_page - 2) * Variables.PAGE_SIZE
                    )
                  }
                >
                  <span aria-hidden="true">
                    <i className="fa fa-angle-left" aria-hidden="true" />
                  </span>
                </a>
              ) : (
                <span aria-hidden="true">
                  <i className="fa fa-angle-left" aria-hidden="true" />
                </span>
              )}
            </li>

            {links_array[0] > 1 && (
              <li>
                {this.createLink(1) // add page 1 link if not in links_array
                }
              </li>
            )}

            {links_array[0] > 2 && ( // add "…" cell if we skip from the beginning
              <li className="disabled ellipses">
                <span aria-hidden="true">…</span>
              </li>
            )}

            {links_array.map((
              pageNum // add links from links_array
            ) => (
              <li
                key={"pagination_" + pageNum}
                className={current_page === pageNum && "active"}
              >
                {this.createLink(pageNum)}
              </li>
            ))}

            {links_array[links_array.length - 1] < total_pages - 1 && ( // add "…" cell if we skip to the end
              <li className="disabled ellipses">
                <span aria-hidden="true">…</span>
              </li>
            )}

            {links_array[links_array.length - 1] < total_pages && ( // add last page link if not in links_array
              <li>{this.createLink(total_pages)}</li>
            )}

            <li className={current_page === total_pages && "disabled"}>
              {current_page !== total_pages ? (
                <a
                  aria-label="Next"
                  onClick={() =>
                    this.props.changePage(current_page * Variables.PAGE_SIZE)
                  }
                >
                  <span aria-hidden="true">
                    <i className="fa fa-angle-right" aria-hidden="true" />
                  </span>
                </a>
              ) : (
                <span aria-hidden="true">
                  <i className="fa fa-angle-right" aria-hidden="true" />
                </span>
              )}
            </li>
          </ul>
        </nav>
      );
    } else {
      return null;
    }
  }
}

Pagination.propTypes = {
  pagination: PropTypes.object.isRequired,
  changePage: PropTypes.func.isRequired
};

export default Pagination;
