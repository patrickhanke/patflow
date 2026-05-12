import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  SectionList,
  Text,
  View
} from 'react-native';
import {
  AppContext,
  GlobalModal,
  ThemeContext,
  useDataStore,
  useFindData
} from '@provider';
import Ticket from './content/Ticket';
import CreateTicket from './components/CreateTicket';
import { isArray } from 'lodash';
import { TicketsProps } from './types';
import sortTicketsForList from './functions/sortTicketsForList';

const Tickets = ({ navigation }: TicketsProps) => {
  const { themeColors, applicationStyles } = useContext(ThemeContext);
  const { user, isConnected } = useContext(AppContext);
  const [modalDataHasChanged, setModalDataHasChanged] = useState(false);
  const tickets = useDataStore(state => state.tickets);
  const properties = useDataStore(state => state.properties);

  const [isVisible, setIsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { loadTickets } = useFindData();

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTickets({ userId: user.objectId });
    setRefreshing(false);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      loadTickets({ userId: user.objectId });
    });

    return navigation.removeListener('focus', unsubscribe);
  }, [navigation, loadTickets, user.objectId]);

  const sectionTickets = useMemo(() => {
    return sortTicketsForList(tickets, properties);
  }, [tickets]);

  return (
    <>
      <View style={applicationStyles.content_container}>
        <View style={applicationStyles.section_top_container} />
        <View style={applicationStyles.section_container}>
          {tickets && isArray(sectionTickets) ? (
            <SectionList
              sections={sectionTickets}
              keyExtractor={item => item.objectId}
              renderItem={({ item, index, section }) => {
                return (
                  <Ticket
                    ticket={item}
                    refetch={() => loadTickets({ userId: user.objectId })}
                    isLast={index === section.data.length - 1}
                  />
                );
              }}
              renderSectionHeader={({ section: { title } }) => (
                <View style={applicationStyles.section_header}>
                  <Text style={applicationStyles.section_header_text}>
                    {title}
                  </Text>
                </View>
              )}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                />
              }
            />
          ) : (
            <Text style={{ color: themeColors.text, marginTop: 18 }}>
              Im Moment keine aktiven Tickets
            </Text>
          )}
        </View>
        <View style={applicationStyles.section_bottom_container}>
          <Pressable
            hitSlop={6}
            onPress={() => setIsVisible(true)}
            style={applicationStyles.add_button}
            disabled={!isConnected}
          >
            <Text style={applicationStyles.add_button_text}>
              + Neues Ticket erstellen
            </Text>
          </Pressable>
        </View>
        <GlobalModal
          isVisible={isVisible}
          dataHasChanged={modalDataHasChanged}
          backHandler={() => {
            setIsVisible(false);
          }}
          title="Neues Ticket erstellen"
        >
          <CreateTicket
            refetch={() => loadTickets({ userId: user.objectId })}
            modalDataHasChanged={modalDataHasChanged}
            setModalDataHasChanged={setModalDataHasChanged}
            closeModal={() => setIsVisible(false)}
          />
        </GlobalModal>
      </View>
    </>
  );
};

export default Tickets;
