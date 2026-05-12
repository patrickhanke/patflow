import { Ticket } from '@types';
import { SortTicketsForList } from '../types';

const sortTicketsForList: SortTicketsForList = (array, properties) => {
  const ticketList: { title: string; data: Ticket[] }[] = [];

  const arrayCopy = [...array];
  for (let i = 0; i < arrayCopy.length; i += 1) {
    if (arrayCopy[i]?.property?.name) {
      let property = arrayCopy[i].property.name;

      const taskListIndex = ticketList.findIndex(
        entry => entry.title === property
      );

      if (property && taskListIndex === -1) {
        ticketList.push({
          title: property,
          data: [arrayCopy[i]]
        });
      } else if (property && taskListIndex !== -1) {
        ticketList[taskListIndex].data.push(arrayCopy[i]);
      } else {
        return null;
      }
    } else {
      const property = properties.find(
        ppty => ppty.objectId === arrayCopy[i].property.objectId
      );

      const propertyTitle = property?.name ?? 'Unbekannt';
      const taskListIndex = ticketList.findIndex(
        entry => entry.title === propertyTitle
      );

      if (taskListIndex === -1) {
        ticketList.push({
          title: propertyTitle,
          data: [arrayCopy[i]]
        });
      } else if (taskListIndex !== -1) {
        ticketList[taskListIndex].data.push(arrayCopy[i]);
      } else {
        return null;
      }
    }
  }

  return ticketList;
};

export default sortTicketsForList;
