
import { TestBed } from '@angular/core/testing';

import { StorageProvider } from './storage.provider';

describe('StorageProvider', () => {
  let service: StorageProvider;
  let localStorageSpy: jasmine.SpyObj<Storage>;

  beforeEach(() => {
    localStorageSpy = jasmine.createSpyObj('localStorage', ['setItem', 'getItem', 'removeItem']);
    Object.defineProperty(window, 'localStorage', { value: localStorageSpy });

    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set an item in localStorage', () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    service.setItem(key, value);
    expect(localStorageSpy.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  it('should get an item from localStorage', () => {
    const key = 'testKey';
    const value = { data: 'testData' };
    localStorageSpy.getItem.and.returnValue(JSON.stringify(value));
    const result = service.getItem(key);
    expect(localStorageSpy.getItem).toHaveBeenCalledWith(key);
    expect(result).toEqual(value);
  });

  it('should return null if item does not exist in localStorage', () => {
    const key = 'testKey';
    localStorageSpy.getItem.and.returnValue(null);
    const result = service.getItem(key);
    expect(localStorageSpy.getItem).toHaveBeenCalledWith(key);
    expect(result).toBeNull();
  });

  it('should remove an item from localStorage', () => {
    const key = 'testKey';
    service.removeItem(key);
    expect(localStorageSpy.removeItem).toHaveBeenCalledWith(key);
  });
});
