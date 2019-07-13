//@flow
import React from 'react';

type starChartProps = {|
  assignments: Assignment[],
  dueDates: DueDate[],
  people: Person[]
|}

type Assignment = {|
  id: number,
  due_date_id: number,
  from_person_id: number,
  to_person_id: number,
  complete: boolean
|};

type DueDate = {|
  id: number,
  date: string
|}

type Person = {|
  id: number,
  name: string,
  initials: string
|}

function StarChart(props: starChartProps) {
  return (<div></div>);
}

export default StarChart;