import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TABS = [
  { key: 'wrf', label: 'WRF', icon: 'weather-cloudy' },
  { key: 'fwi', label: 'FWI', icon: 'fire' },
  { key: 'gases', label: 'Gases', icon: 'chart-bar' },
  { key: 'vientos', label: 'Vientos', icon: 'weather-windy' },
];

interface MainTabsBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainTabsBar: React.FC<MainTabsBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.container}>
      {TABS.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => onTabChange(tab.key)}
        >
          <Icon
            name={tab.icon}
            size={20}
            color={activeTab === tab.key ? '#fff' : '#94a3b8'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 4,
    alignSelf: 'center',
    marginVertical: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
  },
  activeTab: {
    backgroundColor: '#18181b',
  },
  tabLabel: {
    color: '#94a3b8',
    fontWeight: '600',
    fontSize: 15,
  },
  activeTabLabel: {
    color: '#fff',
  },
});

export default MainTabsBar; 