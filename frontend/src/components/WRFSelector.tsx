import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useApi } from '../context/ApiContext';
import { WeatherProduct } from '../types/api';

const VARIABLES = [
  { code: 't2', label: 'Temperatura a 2m', icon: 'thermometer', color: '#f59e42' },
  { code: 'ppn', label: 'Precipitación', icon: 'weather-rainy', color: '#38bdf8' },
  { code: 'wspd10', label: 'Viento a 10m', icon: 'weather-windy', color: '#0ea5e9' },
  { code: 'rh2', label: 'Humedad Relativa', icon: 'water-percent', color: '#818cf8' },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

const WRFSelector: React.FC = () => {
  const { fetchProducts, products, loadingStates } = useApi();
  const [variable, setVariable] = useState(VARIABLES[0].code);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [hour, setHour] = useState('12');
  const [selectedProduct, setSelectedProduct] = useState<WeatherProduct | null>(null);

  useEffect(() => {
    const fetch = async () => {
      await fetchProducts({
        tipo_codigo: 'WRF',
        fecha: date.toISOString().slice(0, 10),
        buscar: variable,
        ordering: 'generated_at',
        page_size: 24,
      });
    };
    fetch();
  }, [variable, date, fetchProducts]);

  useEffect(() => {
    // Buscar producto por hora
    const prod = products.find(p => {
      const h = new Date(p.generated_at).getHours();
      return h === parseInt(hour, 10);
    });
    setSelectedProduct(prod || null);
  }, [products, hour]);

  return (
    <View style={styles.container}>
      {/* Selector de variable */}
      <View style={styles.variablesRow}>
        {VARIABLES.map(v => (
          <TouchableOpacity
            key={v.code}
            style={[styles.variableBtn, variable === v.code && { backgroundColor: v.color }]}
            onPress={() => setVariable(v.code)}
          >
            <Icon name={v.icon} size={20} color={variable === v.code ? '#fff' : '#64748b'} />
            <Text style={[styles.variableLabel, variable === v.code && { color: '#fff' }]}>{v.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Selector de fecha */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity style={styles.dateBtn} onPress={() => {}}>
          <Icon name="calendar" size={18} color="#0ea5e9" />
          <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        <input
          type="date"
          value={date.toISOString().slice(0, 10)}
          onChange={e => setDate(new Date(e.target.value))}
          style={{ marginLeft: 12, padding: 6, borderRadius: 6, border: '1px solid #e0e7ef', fontSize: 15 }}
        />
      </View>
      {/* Selector de hora */}
      <View style={styles.hoursRow}>
        {HOURS.map(h => (
          <TouchableOpacity
            key={h}
            style={[styles.hourBtn, hour === h && styles.hourBtnActive]}
            onPress={() => setHour(h)}
          >
            <Text style={[styles.hourLabel, hour === h && styles.hourLabelActive]}>{h}:00</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Imagen o estado */}
      <View style={styles.imageBox}>
        {loadingStates.products.isLoading ? (
          <ActivityIndicator size="large" color="#0ea5e9" style={{ marginTop: 32 }} />
        ) : selectedProduct ? (
          <Image
            source={{ uri: selectedProduct.file_url }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text style={styles.emptyText}>No hay imagen para esa combinación.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  variablesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  variableBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ef',
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 4,
  },
  variableLabel: {
    marginLeft: 6,
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
    padding: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 6,
    color: '#0ea5e9',
    fontWeight: '600',
    fontSize: 15,
  },
  hoursRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    justifyContent: 'center',
  },
  hourBtn: {
    backgroundColor: '#e0e7ef',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    margin: 2,
  },
  hourBtnActive: {
    backgroundColor: '#0ea5e9',
  },
  hourLabel: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 13,
  },
  hourLabelActive: {
    color: '#fff',
  },
  imageBox: {
    minHeight: 220,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 32,
  },
});

export default WRFSelector; 