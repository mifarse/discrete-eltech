import React, { PropTypes } from 'react'

export default function Table ({ data }) {

  return (
    <div className="table-wrap">
      <table>
        <tbody>
          {data.map((row, i) => 
            <tr key={i}>
              {row.map((col, j) =>
                <td key={j}>{col}</td>
              )}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

Table.propTypes = {
  data  : React.PropTypes.array.isRequired,
}
